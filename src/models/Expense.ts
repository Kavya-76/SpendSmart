import mongoose, { Schema, ObjectId, Document } from 'mongoose';

// TypeScript interface for Expense
export interface IExpense extends Document {
  createdBy: ObjectId; 
  budgetId: ObjectId;
  title: string; 
  amount: number; 
  description?: string; 
  icon?: string; 
  createdAt: Date; 
  updatedAt?: Date; 
}

// Mongoose schema for Expense
const ExpenseSchema: Schema<IExpense> = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
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

// Create the Expense model, or use an existing one to avoid model overwriting errors
const ExpenseModel =
  (mongoose.models?.Expense as mongoose.Model<IExpense>) ||
  mongoose.model<IExpense>('Expense', ExpenseSchema);

export default ExpenseModel;
