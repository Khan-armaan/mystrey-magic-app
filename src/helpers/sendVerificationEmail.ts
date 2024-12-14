import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function  sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse>{
    try{
        console.log(email, username, verifycode)
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'khanedu101@gmail.com',
            subject: 'Mystry message | Verfication code',
            react: VerificationEmail({username, otp: verifycode}),
          });
        return {success: true, message: ' verification email send successfully'}
    } catch( error){
        console.error("Error sending vrification email", error)
        return {success: false, message: 'failed to send verification email'}
    }
}