import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Expense from "@/models/Expense"; // Import your Expense model
import dbConnect from "@/lib/db"; // Ensure you connect to your MongoDB database

export const DELETE = async (
  req: Request,
  context: { params: { expenseId: string } }
) => {
  await dbConnect(); // Connect to the database
  const {params} = context
  const { expenseId } = await params;

  if (!expenseId) {
    return NextResponse.json(
      { error: "ExpenseId not found" },
      { status: 404 }
    );
  }

  try {
    // Delete the expense by ID
    const result = await Expense.findByIdAndDelete(expenseId);

    if (!result) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Expense deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense." },
      { status: 500 }
    );
  }
};
