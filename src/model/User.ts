import mongoose, { Schema, Document } from "mongoose";

// This is an interface similar to creating a schema, type, or datatype.
// Generally, it's a good practice to create an interface for a schema.
export interface Message extends Document { 
    content: string;
    createdAt: Date;
}

// Similar to creating a model in Prisma, this is like creating tables.
// In this schema, each property corresponds to a column in a relational database table.
const MessageSchema: Schema<Message> = new Schema({
    // Defining each column with its type and requirements.
    content: {
        type: Schema.Types.String as unknown as StringConstructor,  // Type as string constructor
        required: true 
    },
    createdAt: {
        type: Schema.Types.Date as unknown as DateConstructor, // Type as date constructor
        required: true,
        default: Date.now  // Sets the default value to the current date
    }
})

// This is another interface, similar to a type for each column in a database table.
// In this case, `User` has properties representing each table column.
export interface User extends Document { 
    username: string;
    email: string;
    password : string;
    verifycode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[]  // Array of Message objects (similar to storing related records in a relational database).
}

// In Mongoose, all types start with a capital letter.
const UserSchema: Schema<User> = new Schema({  // Defines a new User table schema.
    username: {
        type: Schema.Types.String as unknown as StringConstructor,  // Type as string constructor
        required: [true, "username is required"], // Username is required; error message if not provided
        trim: true,  // Removes whitespace from both ends of the username
        unique: true // Ensures that the username is unique
    },
    email: {
        type: Schema.Types.String as unknown as StringConstructor, // Type as string constructor
        required: [true, "email is required"],  // Email is required; error message if not provided
        unique: true,  // Ensures that the email is unique
        match: [/.+\@.+\..+/, "please use a valid email address"] // Uses regex to validate the email format
    },
    password: {
        type: Schema.Types.String as unknown as StringConstructor, // Type as string constructor
        required: [true, "password is required"],    
    },
    verifycode: {
        type: Schema.Types.String as unknown as StringConstructor, // Type as string constructor
        required: [true, "verifycode is required"],    
    },
    verifyCodeExpiry: {
        type: Schema.Types.Date as unknown as DateConstructor, // Type as date constructor
        required: [true, "verifycode expiry is required"],    
    },
    isVerified: {
        type: Schema.Types.Boolean as unknown as BooleanConstructor, // Type as boolean constructor
        default: false,    
    },
    isAcceptingMessage: {
        type: Schema.Types.Boolean as unknown as BooleanConstructor, // Type as boolean constructor
        default: false
    },
    messages: [MessageSchema]  // Array of messages, storing each as a MessageSchema object
})

// Since Next.js runs on the edge, it doesn't know which time it is running.
// We need this check because models may get compiled multiple times during hot reloading in development mode.
const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)

export default UserModel;  // Exporting the UserModel so it can be used throughout the application.
