import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import { currentUserId } from "@/lib/auth";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
  await dbConnect();

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
        { createdBy: new mongoose.Types.ObjectId(String(userId)) }
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
