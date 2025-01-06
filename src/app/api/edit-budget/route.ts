import { BudgetSchema } from "@/schemas";
import dbConnect from "@/lib/db";
import BudgetModel from "@/models/Budget";
import { currentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  await dbConnect(); // Connect to the database
  try {
    const { id, ...body } = await req.json(); // Parse the incoming request body
    const budgetId = String(id);
    const validatedFields = BudgetSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json(
        {
          success: false,
          message: "Enter valid fields",
        },
        { status: 500 }
      );
    }

    const existingBudget = await BudgetModel.findById(budgetId);
    if (!existingBudget) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    const userId = await currentUserId();

    // Check if the budget belongs to the user
    if (existingBudget.createdBy.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { title, amount, description, icon } = validatedFields.data;
    // Update the budget
    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      budgetId,
      {
        icon,
        title,
        amount,
        description,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(
      { success: "Budget Updated Successfully", data: updatedBudget },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in CreateBudget API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
