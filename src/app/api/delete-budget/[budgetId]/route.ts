import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import BudgetModel from "@/models/Budget";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  context: { params: { budgetId: string } }
) => {
  await dbConnect();
  const { params } = context;
  const { budgetId } = await params;
  if (!budgetId) {
    return NextResponse.json({ error: "BudgetId not found" }, { status: 404 });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all expenses associated with the budget
      const deleteExpensesResult = await ExpenseModel.deleteMany(
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
      NextResponse.json(
        { message: "Failed to delete budget and expenses" },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting budget or expenses:", error);
    NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
