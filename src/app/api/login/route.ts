import { NextResponse } from "next/server";
import * as z from "zod";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

// API route for login
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedFields = LoginSchema.safeParse(body);

        // Handle invalid fields
        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
        }

        const { email, password, code } = validatedFields.data;
        const existingUser = await getUserByEmail(email);

        // Handle case where the user does not exist
        if (!existingUser || !existingUser.email || !existingUser.password) {
            return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
        }

        // Send verification email if email is not verified
        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(existingUser.email);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
            return NextResponse.json({ success: "Confirmation email sent!" });
        }

        // Handle two-factor authentication
        if (existingUser.isTwoFactorEnabled && existingUser.email) {
            if (code) {
                const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
                if (!twoFactorToken) {
                    return NextResponse.json({ error: "Invalid code!" }, { status: 400 });
                }

                if (twoFactorToken.token !== code) {
                    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
                }

                const hasExpired = new Date(twoFactorToken.expires) < new Date();
                if (hasExpired) {
                    return NextResponse.json({ error: "Code expired!" }, { status: 400 });
                }

                // Delete the used two-factor token and create a confirmation record
                await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

                const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if (existingConfirmation) {
                    await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
                }

                await db.twoFactorConfirmation.create({
                    data: { userId: existingUser.id },
                });
            } else {
                // Send two-factor token if code is not provided
                const twoFactorToken = await generateTwoFactorToken(existingUser.email);
                await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
                return NextResponse.json({ twoFactor: true });
            }
        }

        // Sign in the user if no two-factor authentication is needed
        await signIn("credentials", { email, password, redirectTo: "/" });

        return NextResponse.json({ success: "Login successful!" });

    } catch (error) {
        console.error("Login error:", error);

        // Handle authentication errors
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return NextResponse.json({ error: "Invalid Credentials!" }, { status: 400 });
                default:
                    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
            }
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
