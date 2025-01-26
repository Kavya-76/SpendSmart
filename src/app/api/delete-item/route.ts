import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import IncomeModel from "@/models/Income";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  await dbConnect();

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  const type = searchParams.get("type");

  if (!itemId) {
    return NextResponse.json({ error: "BudgetId not found" }, { status: 404 });
  }

  try {
    if (type === "income") {
      const deleteResult = await IncomeModel.deleteOne({
        _id: new mongoose.Types.ObjectId(itemId),
      });

      if (deleteResult.deletedCount === 0) {
        throw new Error("Income not found");
      }

      return NextResponse.json(
        {
          message: "Income deleted successfully",
        },
        { status: 200 }
      );
    } else if (type === "expense") {
      const deleteResult = await ExpenseModel.deleteOne({
        _id: new mongoose.Types.ObjectId(itemId),
      });

      if (deleteResult.deletedCount === 0) {
        throw new Error("Expense not found");
      }

      return NextResponse.json(
        {
          message: "Expense deleted successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { message: "Error in delete item api" },
      { status: 500 }
    );
  }
};
