import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mail";

// API route for login
export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const validatedFields = LoginSchema.safeParse(body);

        // Handle invalid fields
        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
        }

        
        
        const { email, password } = validatedFields.data;
        const existingUser = await getUserByEmail(email);
        
        console.log(existingUser);

        // Handle case where the user does not exist
        if (!existingUser || !existingUser.email || !existingUser.password) {
            return NextResponse.json({ error: "Email does not exist" }, { status: 401 });
        }

        // Send verification email if email is not verified
        // if (!existingUser.isVerified) {
        //     const verificationToken = await generateVerificationToken(existingUser.email);
        //     await sendVerificationEmail(verificationToken.email, verificationToken.token);
        //     return NextResponse.json({ success: "Confirmation email sent!" });
        // }

        
        // Sign in the user
        await signIn("credentials", {email, password, redirect: false });


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
