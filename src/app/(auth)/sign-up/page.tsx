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
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
//debouncing technique that we learn in the cohort debouncing
// these are all the states managing the states
//navigation wala router
// before return this is all logic to put data on frontend
//zod implementation
// we can use register instead of form
// check if the username exists or not
// this process can be done in a separate custom hook and can get the value from there
// get the debounced value of the username
// getting response from the backend
// check the username that is entered is unique by sending an API response to the backend
// taking the knowledge of react hook form
// if isSubmitting is true the button is disabled
// if isSubmitting is true then do something; if isSubmitting is not true then do something else
{/**we have already created the form using the useForm */}
{/** this is a function that we have created */}
{/** since the username is always changing, hence we have to do an onChange event but the email is typed at once, no debouncing, so we don’t need the onChange */}
{/** since the username is always changing, hence we have to do an onChange event but the email is typed at once, no debouncing, so we don’t need the onChange */}
{/** if isSubmitting is true the button is disabled */}
const Page = () => {
  // Debouncing technique that we learned in the cohort; debouncing delays actions until a certain time has passed without input.
  // These are all the states managing the states
  const router = useRouter(); // Navigation router for redirecting
  // State variables before return; this is all logic to put data on the frontend
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300); // since using the callback not value we are using the function setUsername
 // if we will be using useDebounceValue we will use username rather than its state funciton setUsername 

  // Zod schema and react-hook-form setup
  const formMethods = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  // Check if the username exists or not
  useEffect(() => {
    const checkUsernameUnique = async () => { // This process can be done in a separate custom hook
      if (username) { // Using the debounced value of the username to limit API calls
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          console.log(response); // Logging the response from the backend
          //we can use let message = response.data.message
          // setUsernameMessage(message) in case the below method will throw any errors
          setUsernameMessage(response.data.message); // Set response message for user feedback
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique(); // Check if the entered username is unique by sending an API request to the backend
  }, [username]);

  // Taking advantage of react-hook-form for managing form data
  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message
      });
      router.replace(`/verify/${username}`);  //route to the verify  page which have the username in the query parameter 
      
    } catch (error) {
      console.log("Error in user signup", error); // Logging any error that occurs during signup
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false); // Ensures button is re-enabled after submission
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);  // changes setUsername to debounced 
                      }}
                    />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <p className={` text-sm ${usernameMessage=== "Username is availaible" ? 'text-green-500': 'text-red-500' } ` }> {usernameMessage} </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
            /><div className="flex justify-center">  <Button type="submit" disabled={isSubmitting}>  {/* Disable button while submitting */}
            {
              // Show a loading spinner if isSubmitting is true, otherwise display 'Signup'
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : ('Signup')
            }
          </Button></div>
          
          </form>
        </FormProvider>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
