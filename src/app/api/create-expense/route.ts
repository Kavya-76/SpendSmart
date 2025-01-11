import mongoose from "mongoose";
import { ExpenseSchema } from "@/schemas";
import dbConnect from "@/lib/db";
import ExpenseModel, { IExpense } from "@/models/Expense";
import { currentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  await dbConnect(); // Connect to the database

  try {
    const body = await req.json(); // Parse the incoming request body
    body.createdAt = new Date(body.createdAt);

    const validatedFields = ExpenseSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return Response.json(
        {
          success: false,
          message: "Enter valid fields",
        },
        { status: 500 }
      );
    }

    const { title, amount, description, icon, budgetId, createdAt} = validatedFields.data;

    // getting userID
    const userId = await currentUserId();
    console.log("Date: ",createdAt);

    
    // Create a new budget
    const newExpense: IExpense = new ExpenseModel({
      createdBy: new mongoose.Types.ObjectId(String(userId)),
      title,
      amount,
      description,
      icon,
      budgetId: new mongoose.Types.ObjectId(String(budgetId)),
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    await newExpense.save(); // Save the new user to the database

    return NextResponse.json(
      {success: "Expense Created Successfully"},
      {status: 200}
    )
  } catch (error) {
    console.error("Error in CreateExpense API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
