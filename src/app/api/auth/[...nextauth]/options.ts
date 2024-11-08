import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                Email: {label: "Email", type: "text"},
                password: {label: "password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{ // define a function for manual login 
                await dbConnect()
                try{
                  const user =  await UserModel.findOne({
                        $or:[ // find by using email or username
                            {email: credentials.identifier}, // check for credentials.identifier
                            {username: credentials.identifier} // check for credentials.identifier
                             ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account first ")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password.toString(), user.password.toString())
                    if (isPasswordCorrect){
                        return user // return user means that the authentication has passed  return goes directly to credentials
                    } else {
                        throw new Error("Incorrect password")
                    } 
                } catch(err: any){
                    throw new Error(err)
                }
            }
        })
    ],
   callbacks: {
    async jwt ({token, user}){
        if(user){  // value is in jwt giving us the user token ke andar user ki values ko inject kr diya 
            token._id = user._id?.toString()  // user id is converted to string 
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }
        return token 
    },
    async session({session, token} : any){ // ab user information token ke andar h to session ko token assign kr diya 
        if(token){
           session.user = session.user || {}; // if not found give empty object  
           session.user._id = token._id  // just like here session.user.id is equal to token id 
           session.user.isVerified = token.isVerified
           session.user.isAcceptingMessages = token.isAcceptingMessages
           session.user.username = token.username
        }
        return session
    }
    
   }, 
    pages:{
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_URL
}