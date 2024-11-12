import { Message } from "@/model/User";
// this is we have defined how an api response from the backend  will look alike 
export interface ApiResponse {
    success : boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message> 

}