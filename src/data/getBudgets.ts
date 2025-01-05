"use server"
import mongoose from "mongoose";
import BudgetModel, { IBudgetExtended } from "@/models/Budget";
import dbConnect from "@/lib/db";

export const getBudgets = async (userId: string): Promise<IBudgetExtended[]> => {
  await dbConnect();

  const budgets = await BudgetModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "expenses",
        localField: "_id",
        foreignField: "budgetId",
        as: "expenses",
      },
    },
    {
      $addFields: {
        totalSpend: { $sum: "$expenses.amount" },
        totalItem: { $size: "$expenses" },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  // Transform the data to make it serializable
  const serializedBudgets = budgets.map((budget) => ({
    ...budget,
    _id: budget._id.toString(), // Convert ObjectId to string
    createdBy: budget.createdBy.toString(), // Convert ObjectId to string
    createdAt: budget.createdAt?.toISOString() || null, // Serialize date
    updatedAt: budget.updatedAt?.toISOString() || null, // Serialize date
    totalSpend: 1000
  }));

  return serializedBudgets;
};
