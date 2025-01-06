import { NextResponse } from "next/server";
import ExpenseModel from "@/models/Expense"; // Import your Expense model
import dbConnect from "@/lib/db"; // Ensure you connect to your MongoDB database

export const DELETE = async (
  req: Request,
  context: { params: { expenseId: string } }
) => {
  await dbConnect(); // Connect to the database

  const { params } = context;
  const { expenseId } = await params;

  if (!expenseId) {
    return NextResponse.json(
      { error: "Expense ID is required." },
      { status: 400 }
    );
  }

  try {
    // Find the expense by ID
    const expense = await ExpenseModel.findById(expenseId);

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }

    // Delete the expense
    await expense.deleteOne();

    return NextResponse.json(
      { message: "Expense deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense:", error);

    return NextResponse.json(
      { error: "Internal server error. Failed to delete expense." },
      { status: 500 }
    );
  }
};
