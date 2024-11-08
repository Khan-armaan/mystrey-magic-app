import { NextResponse} from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import  { getToken } from "next-auth/jwt"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request}) // this token we are getting using the next-auth
    const url = request.nextUrl // to get the current url using ext url
    if (token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
 if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/sign-In', request.url))
 }
 return NextResponse.next()
 
}
 
// See "Matching Paths" below to learn more ie the pahts where the middleware will apply
export const config = { 
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
     
]
}

