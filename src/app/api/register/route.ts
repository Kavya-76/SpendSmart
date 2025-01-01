"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse the incoming request body
    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      return new Response(JSON.stringify({ error: "Invalid fields!" }), { status: 400 });
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use!" }), { status: 409 });
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return new Response(JSON.stringify({ success: "Confirmation email sent" }), { status: 201 });
  } catch (error) {
    console.error("Error in register API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
