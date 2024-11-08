import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()
    //message koi bhi bhej skta h to user authentication krna zarurut nhi h session se nikal ke

    // values from the client using request.json()
    const { username, content } =  await request.json()

    try {
      const user = await UserModel.findOne({username}) // every query have to be awaited 
      // user nhi mila
      if(!user){
        return Response.json({
            success: false,
            message: 'User not found'
        }, {status: 404})
      }
      //user mil gya to
      // check if the user is accepting the message 
      if (!user.isAcceptingMessage){
        return Response.json({
            success: false,
            message: 'User is not accepting the messages'
        }, {status:403})
      }
      // now message 
      const newMessage = {content, createdAt : new Date()} // creating a message object 
      user.messages.push(newMessage as Message)
      await user.save()
      return Response.json({
        success: true,
        message: 'message sent successfully',

      })


    } catch (error) {
        console.log('An unexpected error occoured', error)
        return Response.json({
            success: false,
            message: 'Internal Server Error'
        },{status: 500})
    }

    
}