import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import UserModel, { IUser } from "@/models/User"; // Import the Mongoose User model
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const POST = async (req: Request) => {
  await dbConnect(); // Connect to the database

  try {
    const body = await req.json() // Parse the incoming request body
    
    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json(
        {
          success: false,
          message: "Enter valid credentials",
        },
        { status: 500 }
      );
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return Response.json(
        { error: "Email already in use!" },
        {status: 409}
      );
    }

    // Create a new user
    const newUser: IUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save the new user to the database

    
    // Optional: Send verification email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return Response.json({ success: "Confirmation email sent!" }, {status: 200});

  } catch (error) {
    console.error("Error in register API:", error);
    return Response.json(
      { error: "Internal server error" },
      {status: 500}
    );
  }
};
