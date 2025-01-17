import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import IncomeModel from "@/models/Income";
import { currentUserId } from "@/lib/auth";
import mongoose from "mongoose";

export const GET = async () => {
  await dbConnect();

  try {
    const userId = await currentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Fetch incomes for the current user
    const incomes = await IncomeModel.find(
        { createdBy: new mongoose.Types.ObjectId(String(userId)) }
    );

    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/incomes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
