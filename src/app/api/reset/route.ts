"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const POST = async (req: Request) => {
  try {
    // Parse incoming JSON request body
    const { email } = await req.json();
    
    // Validate the email using the ResetSchema
    const validatedFields = ResetSchema.safeParse({ email });

    if (!validatedFields.success) {
      return new Response(
        JSON.stringify({ error: "Invalid email!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user with this email exists
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email does not exist" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a password reset token and send the reset email
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    // Respond with success message
    return new Response(
      JSON.stringify({ success: "Reset email sent!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling password reset:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
