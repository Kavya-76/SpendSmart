import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import BudgetModel from "@/models/Budget";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ budgetId: string }> } // Update params to a Promise
) => {
  await dbConnect();

  // Unwrap the params Promise
  const { budgetId } = await context.params;

  if (!budgetId) {
    return NextResponse.json({ error: "BudgetId not found" }, { status: 404 });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all expenses associated with the budget
      await ExpenseModel.deleteMany(
        { budgetId: new mongoose.Types.ObjectId(budgetId) },
        { session }
      );

      // Delete the budget itself
      const deleteBudgetResult = await BudgetModel.deleteOne(
        { _id: new mongoose.Types.ObjectId(budgetId) },
        { session }
      );

      if (deleteBudgetResult.deletedCount === 0) {
        throw new Error("Budget not found");
      }

      await session.commitTransaction();

      return NextResponse.json(
        {
          message: "Budget and associated expenses deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction error:", error);
      return NextResponse.json(
        { message: "Failed to delete budget and expenses" },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting budget or expenses:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
