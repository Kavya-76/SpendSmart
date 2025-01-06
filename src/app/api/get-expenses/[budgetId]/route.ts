import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import mongoose from "mongoose";

export const GET = async (
  req: Request,
  context: { params: { budgetId: string } }
) => {
  await dbConnect();

  try {
    const { params } = context;
    const { budgetId } = await params;

    const expenses = await ExpenseModel.find({
      budgetId: new mongoose.Types.ObjectId(budgetId),
    }).sort({ createdAt: -1 });

    return NextResponse.json(expenses, 
      { status: 200 });

  } catch (error) {
    console.error("Error in GetExpense API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
