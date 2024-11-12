import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; // not the next auth user 
import mongoose, { mongo } from "mongoose";


export async function GET (){
    await dbConnect()

    // to find out who you are finding out the session 
    // code to find out hte user which user
    const session = await getServerSession(authOptions)
    const user: User =   session?.user as User // assert 
     console.log(user)
    if (!session || !session.user){
       return Response.json({
           success: false,
           message: 'not authenticated'
       }, { status: 401 })
    }
    //since userid is a string to do create some issues in agggregate pipeline 
   // how to write aggregation pipeline 
   const userId = new mongoose.Types.ObjectId(user?._id);

   try {
    const user = await UserModel.aggregate([
        {$match: {_id: userId}},
        {$unwind: '$messages'},
        {$sort: {'messages.createdAt': -1}}, // in descending order 
        {$group: {_id: '$_id', messages: {$push: '$messages'}}}
    ])
    if (!user || user.length === 0){ //
        return Response.json({
            success: false,
            message: 'user not found'
        }, {status: 401})
    }
    return Response.json({
        success: true,
        messages: user[0].messages
    }, {status: 200})
   } catch (error) {
    console.log('error', error)
    return Response.json({
        sucess: false,
        message: 'error'
    }, {status: 500})
   }
}