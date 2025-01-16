import { ExpenseSchema } from "@/schemas"; // Replace with your actual schema for expense validation
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense"; // Import your Expense model
import { currentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  await dbConnect(); // Connect to the database
  try {
    const { id, ...body } = await req.json(); // Parse the incoming request body
    const expenseId = String(id); // Extract expense ID
    const validatedFields = ExpenseSchema.safeParse(body); // Validate fields using your schema

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter valid fields",
        },
        { status: 400 }
      );
    }

    const existingExpense = await ExpenseModel.findById(expenseId);
    if (!existingExpense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    const userId = await currentUserId();

    // Check if the expense belongs to the user
    if (existingExpense.createdBy.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { title, amount, description } = validatedFields.data;
    // Update the expense
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      expenseId,
      {
        title,
        amount,
        description,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(
      { success: "Expense Updated Successfully", data: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in EditExpense API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
