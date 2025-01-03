"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  await dbConnect();

  try {
    const body = await req.json();
    const { values, token } = body;

    // Validate the token
    if (!token) {
      return NextResponse.json(
        { error: "Missing token!" },
        { status: 400 }
      );
    }

    // Validate the fields using Zod schema
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields!" },
        { status: 400 }
      );
    }

    const { password } = validatedFields.data;

    // Check if the reset token exists
    const existingToken = await PasswordResetToken.findOne({ token });
    if (!existingToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    // Check if the reset token has expired
    if (new Date(existingToken.expires) < new Date()) {
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    // Verify if the associated user exists
    const existingUser = await User.findOne({ email: existingToken.email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 400 }
      );
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    // Delete the used password reset token
    await PasswordResetToken.deleteOne({ _id: existingToken._id });

    return NextResponse.json(
      { success: "Password updated!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
