import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; // not the next auth user 

// function to check if the user is accepting messages or not  
// get the current user using the session of next auth
// from session finding the user and then the user id 
export async function POST(request: Request){ // this function changes the accepting messages boolean value to true or false from the user using te boolean value 
    await dbConnect()
   
    // code to find out hte user which user
     const session = await getServerSession(authOptions)
     const user: User =   session?.user as User // assert 

     if (!session || !session.user){
        return Response.json({
            success: false,
            message: 'not authenticated'
        }, { status: 401 })
     }
    const userId =  user._id
   const {acceptMessages} = await request.json() // from the body boolean value is accepting messages or not 

   try{
    // from the userId finding the user in the database and updating the user 
    // 
   const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessage: acceptMessages},
        {new: true} // get the new updatesd value
    )
    if (!updatedUser)
    {
        return Response.json(
            {
                success: false,
                messages: "faild to update user status to accept messages"
            },
            {
                status: 401
            }
        )
    }
    return Response.json(
        {
            success: true,
            messages: "message acceptance status updated successfully",
            updatedUser
        },
        {
            status: 200
        }
    )

} catch(error ) {
    console.log("failed to update user status to accept messages", error)
    return  Response.json({
        success: false,
        message: "faild to update user stats to accept messages"
    },  {status: 500})

}
}

export async function GET (){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User =   session?.user as User // assert 

    if (!session || !session.user){
       return Response.json({
           success: false,
           message: 'not authenticated'
       }, { status: 401 })
    }
   const userId =  user._id; // since username is also unique so we can find by it 

    try{
        const foundUser = await UserModel.findById(userId)
  
        if (!foundUser){
          return Response.json({
              success: false,
              message: 'user not found'
          }, { status: 404 })
        }
        return Response.json({
          success: true,
          isAcceptingMessage: foundUser.isAcceptingMessage
      }, { status: 200 })
    } catch(error){
        console.log("failed to know the user status ", error)
        return  Response.json({
            success: false,
            message: "Error in gettting messages  acceptance status"
        },  {status: 500})
    }

}
