import mongoose, { Schema, ObjectId, Document } from 'mongoose';

// TypeScript interface for Income
export interface IIncome extends Document {
  createdBy: ObjectId; 
  title: string;
  amount: number; 
  description?: string; 
  icon?: string;
  createdAt: Date; 
  updatedAt?: Date;
}

export interface IIncomeExtended extends Document {
  createdBy: ObjectId; 
  title: string;
  amount: number; 
  description?: string; 
  icon?: string;
  createdAt: Date; 
  updatedAt?: Date;
  totalSpend: number;
  totalItem: number;
}

// Mongoose schema for Income
const IncomeSchema: Schema<IIncome> = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

// Create the Income model, or use an existing one to avoid model overwriting errors
const IncomeModel =
  (mongoose.models?.Income as mongoose.Model<IIncome>) ||
  mongoose.model<IIncome>('Income', IncomeSchema);

export default IncomeModel;
