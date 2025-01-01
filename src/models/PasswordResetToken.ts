import mongoose, { Document, Schema } from 'mongoose';

// Interface for PasswordResetToken document
interface IPasswordResetToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

// PasswordResetToken Schema
const passwordResetTokenSchema: Schema<IPasswordResetToken> = new Schema({
  email: { 
    type: String, 
    required: true 
  },
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  expires: { 
    type: Date, 
    required: true 
  },
}, {
  timestamps: true, 
});

// Define a compound index for [email, token] to ensure uniqueness
passwordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

// PasswordResetToken Model
const PasswordResetTokenModel = (mongoose.models?.PasswordResetToken as mongoose.Model<IPasswordResetToken>) || mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema)
export default PasswordResetTokenModel; 