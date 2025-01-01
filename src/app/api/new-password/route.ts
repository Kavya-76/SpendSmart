"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    // Parse the request body
    const body = await req.json();
    const { values, token } = body;

    // Validate the token
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing token!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate the fields using Zod schema
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return new Response(
        JSON.stringify({ error: "Invalid fields!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { password } = validatedFields.data;

    // Check if the reset token exists
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the reset token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return new Response(
        JSON.stringify({ error: "Token has expired" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify if the associated user exists
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: "Email does not exist" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    // Delete the used password reset token
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    // Return success response
    return new Response(
      JSON.stringify({ success: "Password updated!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
