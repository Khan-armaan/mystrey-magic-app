import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
// api to check the status of use if he is accpeting messages or not 
export  async function GET(req: Request){
    await dbConnect()
    try {
        // to get the query parameter on an api request that is the server side we use this 
        const {searchParams} = new URL(req.url)  // to extract the url
        const queryParam = { // creating the object that is the syntax
            username: searchParams.get('username') // extracting query parameters from the url
        // this type of api request `/api/check-username-unique?username=${username}`
        }
        const username = queryParam.username
        
        // db call 
     const user  =  await UserModel.findOne({
            username
        })
        if(!user){
            return NextResponse.json({
                success: false,
                message: "Cannot find username"

            },{status: 200})
        }
        const isAcceptingMessage = user.isAcceptingMessage
        return NextResponse.json({
            success: true,
            isAcceptingMessage
        },{status: 200})
     } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}