import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BudgetModel from "@/models/Budget";
import mongoose from "mongoose";
import { currentUserId } from "@/lib/auth";

export const GET = async (
  req: Request,
  context: { params: Promise<{ budgetId: string }> }
) => {
  await dbConnect();

  // Await the promise to unwrap the params
  const { budgetId } = await context.params;

  try {
    const userId = await currentUserId();
    const budgets = await BudgetModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(String(userId)),
          _id: new mongoose.Types.ObjectId(budgetId),
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

    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    console.error("Error in GetBudgets API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
