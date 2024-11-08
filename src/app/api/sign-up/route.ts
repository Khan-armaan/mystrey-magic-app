import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"; // Corrected the import
// request to create the user
export async function POST(request: Request) {
  await dbConnect(); // Ensure the database is connected

  try {
    const { username, email, password } = await request.json(); // Parse the request body
    console.log(username, email, password);

    // Check if a verified user with the same username exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if a user with the same email exists
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate verification code
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // User exists but may not be verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "The user already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // Update password and verification details for unverified user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifycode = verifycode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      // Create new user if not existing
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set verification expiry to 1 hour

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifycode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(username, email, verifycode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
 console.log(emailResponse)
    // If email is successfully sent, return success response
    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error); // Log the actual error
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}

