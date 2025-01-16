import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BudgetModel from "@/models/Budget";
import mongoose from "mongoose";
import { currentUserId } from "@/lib/auth";

export const GET = async () => {
  await dbConnect();

  try {
    const userId = await currentUserId();
    console.log(userId)
    const budgets = await BudgetModel.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(String(userId)),
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

    return NextResponse.json(budgets, 
      { status: 200 });

  } catch (error) {
    console.error("Error in GetBudgets API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
