// documents ban ban kar array me ja rahe h so we use pull operator of mongodb 
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; // not the next auth user 


// api to delete message 
export async function DELETE (request: Request, {params}: {params  // to take the parameters from the url 
    :{messageid: string}}){ 
       const messageId  =  params.messageid  // taking params as an object 
    await dbConnect()

    // to find out who you are finding out the session 
    // code to find out hte user which user
    const session = await getServerSession(authOptions) // getiing the session from the seever 
    const user: User =   session?.user as User // assert 
     console.log(user)
    if (!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        },{status: 401})
    }


   try {
    const updateReseult = await UserModel.updateOne( // first find the user from the user id and than delete the message from the array of object messages from the user
            {_id: user._id} , // where to match finnd the user user has an array of messages we have to delete one of the element of the array
            {$pull: {messages:{_id:messageId}}} // each message is an individual document so has to pull the document whose id mathches to delete using the query parameters from the urk 

    )
    if(updateReseult.modifiedCount == 0){ // if nothing has changed during updation
        return Response.json({
            success: false,
            message: "message not found or already deleted"
        },{status: 404})
    }
    return Response.json({
        success: true,
        message: "message has been deleted"
    },{status: 200})    

   } catch (error) {
    console.log("Error in deleting route", error)
    return Response.json({
        success: false,
        message: "Error deleting message"
    },{status: 500})
   }
}