import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import mongoose from "mongoose";

export const GET = async (
  req: Request,
  context: { params: Promise<{ budgetId: string }> }
) => {
  await dbConnect();

  try {
    // Await the params to resolve the Promise
    const { budgetId } = await context.params;

    const expenses = await ExpenseModel.find({
      budgetId: new mongoose.Types.ObjectId(budgetId),
    }).sort({ createdAt: -1 });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error in GetExpense API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
