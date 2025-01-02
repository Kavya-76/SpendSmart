import PasswordResetTokenModel from "@/models/PasswordResetToken";
import VerificationTokenModel from "@/models/VerificationToken";
import dbConnect from "./db";
import { v4 as uuidv4 } from "uuid";

await dbConnect();

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  // Delete existing token for this email
  await PasswordResetTokenModel.deleteOne({ email });

  // Create a new password reset token
  const passwordResetToken = await PasswordResetTokenModel.create({
    email,
    token,
    expires,
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  // Delete existing token for this email
  await VerificationTokenModel.deleteOne({ email });

  // Create a new verification token
  const verificationToken = await VerificationTokenModel.create({
    email,
    token,
    expires,
  });

  return verificationToken;
};
