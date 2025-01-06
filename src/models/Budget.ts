import mongoose, { Schema, ObjectId, Document } from 'mongoose';

// TypeScript interface for Budget
export interface IBudget extends Document {
  createdBy: ObjectId; 
  title: string;
  amount: number; 
  description?: string; 
  icon?: string;
  createdAt: Date; 
  updatedAt?: Date;
}

export interface IBudgetExtended extends Document {
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

// Mongoose schema for Budget
const BudgetSchema: Schema<IBudget> = new Schema(
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

// Create the Budget model, or use an existing one to avoid model overwriting errors
const BudgetModel =
  (mongoose.models?.Budget as mongoose.Model<IBudget>) ||
  mongoose.model<IBudget>('Budget', BudgetSchema);

export default BudgetModel;
