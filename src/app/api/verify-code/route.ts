import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, code} = await request.json();
        
        // decoding things coming from url
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 500}
            ) 
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date()

        if(isCodeValid && isCodeNotExpired)
        {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {status: 200}
            ) 
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired. Please signup again to get a new code"
                },
                {status: 400}
            ) 
        } else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verication Code"
                },
                {status: 400}
            ) 
        }


    } catch (error) {
        console.error("Error verifying user",error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {status: 500}
        )
    }
}