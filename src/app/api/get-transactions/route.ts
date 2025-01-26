import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import IncomeModel from "@/models/Income";
import mongoose from "mongoose";
import { currentUserId } from "@/lib/auth";

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
    const userId = await currentUserId(); // Get the current user's ID
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Fetch incomes and expenses within the date range
    const [incomes, expenses] = await Promise.all([
      IncomeModel.find({
        createdBy: new mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      })
        .select("icon title amount description createdAt")
        .lean(),

      ExpenseModel.find({
        createdBy: new mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      })
        .select("icon title amount description createdAt")
        .lean(),
    ]);

    // Add type field to distinguish between incomes and expenses
    const incomeData = incomes.map((income) => ({
      ...income,
      type: "income",
    }));

    const expenseData = expenses.map((expense) => ({
      ...expense,
      type: "expense",
    }));

    // Merge and sort the data by date
    const mergedData = [...incomeData, ...expenseData].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(mergedData, { status: 200 });
  } catch (error) {
    console.error("Error in GetTransactions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
