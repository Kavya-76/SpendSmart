"use server";

import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // Parse incoming JSON request body
    const { email } = await req.json();

    // Validate the email using the ResetPasswordSchema
    const validatedFields = ResetPasswordSchema.safeParse({ email });

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid email!" }, { status: 400 });
    }

    // Check if the user with this email exists
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 400 }
      );
    }

    // Generate a password reset token and send the reset email
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    // Respond with success message
    return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });
  } catch (error) {
    console.error("Error handling password reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
