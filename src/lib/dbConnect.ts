
import mongoose from "mongoose";

 type ConnectionOject = {// it is a only a type have to create a object or variableto assign this type to  
    isConnected? :number
 }

 const connection : ConnectionOject = {}

 async function dbConnect (): Promise<void> {
// since we are working on an edge technology 
// which is not all time running so it is good to check if the databese is already connected or not 
    if (connection.isConnected){
        console.log('Alredy connected to database')
        return 
    }
    try{
       const db = await mongoose.connect(process.env.MONGODB_URI || "") //there are also option in mongodb
      
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Succesfully");
        
    } catch (error){
        console.log("DB connection unsuccesfull", error)
        process.exit(1)
    }
 }

 export default dbConnect;  // exported the function default 