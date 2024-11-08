import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})
// api call to check if the username is alredy existed or not 
export async function GET (request: Request){
   
    await dbConnect()
    try{
        const {searchParams} = new URL(request.url)  // to extract the url
        const queryParam = { // creating the object that is the syntax
            username: searchParams.get('username') // extracting query parameters from the url
        }
        //validataion with zod
        const reseult = UsernameQuerySchema.safeParse(queryParam)
        console.log(reseult)
        if (!reseult.success){
            const usernameErrors = reseult.error.format().username?._errors || [] // returns an array of errors
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalild query parameters'
            },{status: 400})
        }
        const { username } = reseult.data //after checking the console.log of the reseult we ger after the zod validation 
       // database interaction during the api call doing the CRUD operation finding the user using the username 
   const existingVerifiedUser =    await UserModel.findOne({ username, isVerified: true})
   if ( existingVerifiedUser ){
    return Response.json({
        success: false,
        message: 'Username is alredy taken'
    }, {status : 400})
   }
   return Response.json({
    success: true,
    message: 'Username is availaible'
   }, { status: 200 })
    } catch(error){
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}