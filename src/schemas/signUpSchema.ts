import { z } from "zod";
// for input validation that is coming form the client or the user input ie body
export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 character")
    .max(20, "Username mest be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any specail characters")

export const SignUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}), // if not the type of email give the message as inalid email 
    password: z.string().min(6 ,{message: 'password must be atleast 6 character'})
})
    