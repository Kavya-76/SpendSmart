import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BudgetModel from "@/models/Budget";
import ExpenseModel from "@/models/Expense";
import IncomeModel from "@/models/Income";
import { currentUserId } from "@/lib/auth";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if (!fromDate || !toDate) {
    return NextResponse.json(
      { error: "Missing required date range parameters" },
      { status: 400 }
    );
  }

  try {
    const userId = await currentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Convert dates to JavaScript Date objects
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // Include the full day for the range

    const budgetStats = await BudgetModel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } }, // Filter budgets by userId
      {
        $group: {
          _id: null,
          totalBudgets: { $sum: 1 }, // Count total number of budgets
          totalBudgetAmount: { $sum: "$amount" }, // Sum of all budget amounts
        },
      },
    ]);

    const totalBudgets = budgetStats[0]?.totalBudgets || 0;
    const totalBudgetAmount = budgetStats[0]?.totalBudgetAmount || 0;

    // Fetch total income within the date range
    const totalIncomeResult = await IncomeModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: from, $lte: to },
        },
      },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);
    const totalIncomeAmount = totalIncomeResult[0]?.totalIncome || 0;

    // Fetch total expenses within the date range
    const totalExpenseResult = await ExpenseModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: from, $lte: to },
        },
      },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
    ]);
    const totalExpenseAmount = totalExpenseResult[0]?.totalExpense || 0;

    // Return the computed values
    return NextResponse.json({
      totalBudgets,
      totalBudgetAmount,
      totalIncomeAmount,
      totalExpenseAmount,
    });
  } catch (error) {
    console.error("Error in get-dashboard-numbers API", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
