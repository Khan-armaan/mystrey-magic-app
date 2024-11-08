import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";
// fucntion to verify the code form the user 
export async function POST(requst: Request){
    await dbConnect()

    try{ 
        const { username, code } = await requst.json()
        const decodedUsername  = decodeURIComponent(username)
        const user =  await UserModel.findOne({
            username: decodedUsername
        })
        if (!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 500})
        }
        const isCoeValid = user.verifycode === code // checking if the code from the client is same as the code in database of the user 
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)  > new Date(); // checking if the code is expired or not by checking the current date and the date in the database 

        if ( isCoeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
             
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {status: 200})
        } else if( !isCodeNotExpired ) {
            return Response.json({
                success: false,
                message: "Verification code has expired please signup again to get the new verification"
            }, {status: 400})
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verifcation code"
            }, {status: 500})
        }


    } catch(error) {
        console.log("Error verifying the user", error)
        return Response.json({
            success: false,
            messageL :"Error verifying the user"
        }, {status: 500})
    }
}
