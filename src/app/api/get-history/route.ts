import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import IncomeModel from "@/models/Income";
import mongoose from "mongoose";
import { currentUserId } from "@/lib/auth";
import { historyDataType } from "@/app/(protected)/dashboard/_components/History";

export const GET = async (req: NextRequest) => {
  await dbConnect();

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const timeFrame = searchParams.get("timeFrame"); // "month" or "year"
  const monthStr = searchParams.get("month"); // For "month" timeFrame
  const yearStr = searchParams.get("year"); // Required for both time frames
  if (!timeFrame || !yearStr || (timeFrame === "month" && !monthStr)) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const userId = await currentUserId(); // Get the current user's ID
    const year = parseInt(yearStr, 10);
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    let result:historyDataType[] = [];

    if (timeFrame === "month") {
      const month = parseInt(monthStr!, 10);
      const daysInMonth = new Date(year, month, 0).getDate(); // Get number of days in the month
      const startDate = new Date(year, month, 1); // First day of the month
      const endDate = new Date(year, month, daysInMonth, 23, 59, 59); // Last day of the month

      const [incomes, expenses] = await Promise.all([
        IncomeModel.find({
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
        })
          .select("amount createdAt")
          .lean(),

        ExpenseModel.find({
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
        })
          .select("amount createdAt")
          .lean(),
      ]);

      // Prepare daily data
      const dailyData = Array.from({ length: daysInMonth }, (_, day) => ({
        year,
        month,
        day: day + 1,
        income: 0,
        expense: 0,
      }));

      // Aggregate income and expenses by day
      incomes.forEach(({ amount, createdAt }) => {
        const date = new Date(createdAt);
        const dayIndex = date.getDate() - 1;
        dailyData[dayIndex].income += amount;
      });

      expenses.forEach(({ amount, createdAt }) => {
        const date = new Date(createdAt);
        const dayIndex = date.getDate() - 1;
        dailyData[dayIndex].expense += amount;
      });

      result = dailyData;
    } else if (timeFrame === "year") {
      const [incomes, expenses] = await Promise.all([
        IncomeModel.find({
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        })
          .select("amount createdAt")
          .lean(),

        ExpenseModel.find({
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        })
          .select("amount createdAt")
          .lean(),
      ]);

      // Prepare monthly data
      const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => ({
        year,
        month: monthIndex,
        income: 0,
        expense: 0,
      }));

      // Aggregate income and expenses by month
      incomes.forEach(({ amount, createdAt }) => {
        const date = new Date(createdAt);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].income += amount;
      });

      expenses.forEach(({ amount, createdAt }) => {
        const date = new Date(createdAt);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].expense += amount;
      });

      result = monthlyData;
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in GetTransactions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
