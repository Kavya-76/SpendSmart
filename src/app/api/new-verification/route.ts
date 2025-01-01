"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const POST = async (req: Request) => {
  try {
    const { token } = await req.json(); // Parse the incoming request body to extract the token.

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the verification token exists
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      return new Response(
        JSON.stringify({ error: "Token does not exist!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return new Response(
        JSON.stringify({ error: "Token has expired" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user exists
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: "Email does not exist" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user to mark the email as verified
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    // Delete the verification token
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return new Response(
      JSON.stringify({ success: "Email Verified!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
