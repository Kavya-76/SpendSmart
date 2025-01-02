"use server";

import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import VerificationTokenModel from "@/models/VerificationToken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await dbConnect();

    const { token } = await req.json(); // Parse the incoming request body to extract the token.

    if (!token) {
      return NextResponse.json(
        {
          error: "Token is required",
        },
        { status: 400 }
      );
    }

    // Check if the verification token exists
    const existingToken = await VerificationTokenModel.findOne({ token });
    if (!existingToken) {
      return NextResponse.json(
        {
          error: "Token does not exist!",
        },
        { status: 400 }
      );
    }

    // Check if the token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
        {
          error: "Token has expired",
        },
        { status: 400 }
      );
    }

    // Check if the user exists
    const existingUser = await UserModel.findOne({
      email: existingToken.email,
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          error: "Email does not exist",
        },
        { status: 400 }
      );
    }

    // Update the user to mark the email as verified
    existingUser.isVerified = true;
    existingUser.email = existingToken.email;
    await existingUser.save();

    // Delete the verification token
    await VerificationTokenModel.deleteOne({ _id: existingToken._id });

    return NextResponse.json(
      {
        success: "Email Verified!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
