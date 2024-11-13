'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form"; // FormProvider used to wrap the form fields
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  // Debouncing technique that we learned in the cohort; debouncing delays actions until a certain time has passed without input.
  // These are all the states managing the states
  const router = useRouter(); // Navigation router for redirecting
  // State variables before return; this is all logic to put data on the frontend

  const [isSubmitting, setIsSubmitting] = useState(false);
 
 // if we will be using useDebounceValue we will use username rather than its state funciton setUsername 

  // Zod schema and react-hook-form setup
    const formMethods = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  

  // Taking advantage of react-hook-form for managing form data
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
  const reseult =   await signIn('credentials', { // signin in using the next auth using the  credentials 
    redirect: false,
    identifier: data.identifier,
    password: data.password
   })
   if (reseult?.error) {
    setIsSubmitting(false)
    toast({
      title: 'Login failed',
      description: "Incorrect Username or password",
      variant: "destructive"
    })
   }
   if (reseult?.url) { // sign in pe hame url milta h
    setIsSubmitting(false)
    router.replace('/dashboard')
   }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6"> {/** i think we only need to give the function which takes the data annd makes the backend call automatically using reaact form hook */}
          
            <FormField
              control={formMethods.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <div className="flex justify-center">  <Button type="submit" disabled={isSubmitting}>  {/* Disable button while submitting */}
            {
              // Show a loading spinner if isSubmitting is true, otherwise display 'Signup'
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : ('Sign In')
            }
          </Button></div>
          </form>
        </FormProvider>
        <div className="text-center mt-4">
          <p>
            Don't have an Account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;