"use server"
import * as z from "zod";
import dbConnect from "@/lib/db"
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_DIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values:z.infer<typeof LoginSchema>) => {
    await dbConnect();
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid fields!"}
    }

    const {email, password} = validatedFields.data;
    const existingUser = await getUserByEmail(email)
    if(!existingUser || !existingUser.email || !existingUser.password ) {
        return {error: "Email does not exist"}
    }
    
    if(!existingUser.isVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        console.log(verificationToken);
        
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: "Confirmation email sent!"}
    }
    try {
        await signIn("credentials", {email, password, redirectTo: DEFAULT_LOGIN_DIRECT})
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){ 
                case "CredentialsSignin":
                    return {error: "Invalid Credentials!"}
                default:
                    return {error: "Something went wrong"}
            }
        }

        throw error;
    }
}