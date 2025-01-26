import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import { currentUserId } from "@/lib/auth";
import mongoose from "mongoose";

export const GET = async (req:NextRequest) => {
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

    // Fetch expenses for the current user
    const expenses = await ExpenseModel.find(
        { 
          createdBy: new mongoose.Types.ObjectId(String(userId)),
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        }
    );

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error in get-all-expenses api", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
