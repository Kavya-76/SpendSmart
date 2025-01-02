import mongoose, { Document, Schema } from "mongoose";

// Interface for VerificationToken document
interface IVerificationToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

// VerificationToken Schema
const verificationTokenSchema: Schema<IVerificationToken> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Define a compound index for [email, token] to ensure uniqueness
verificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

// VerificationToken Model
const VerificationTokenModel = (mongoose.models?.VerificationToken as mongoose.Model<IVerificationToken>) || mongoose.model<IVerificationToken>("VerificationToken", verificationTokenSchema)
export default VerificationTokenModel; 