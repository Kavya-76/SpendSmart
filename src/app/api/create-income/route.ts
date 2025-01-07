import * as z from "zod";
import mongoose from "mongoose";
import { IncomeSchema } from "@/schemas";
import dbConnect from "@/lib/db";
import IncomeModel, { IIncome } from "@/models/Income";
import { currentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  await dbConnect(); // Connect to the database

  try {
    const body = await req.json(); // Parse the incoming request body
    const validatedFields = IncomeSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return Response.json(
        {
          success: false,
          message: "Enter valid fields",
        },
        { status: 500 }
      );
    }

    const { title, amount, description, icon } = validatedFields.data;

    // getting userID
    const userId = await currentUserId();

    
    // Create a new budget
    const newIncome: IIncome = new IncomeModel({
      createdBy: new mongoose.Types.ObjectId(String(userId)),
      title,
      amount,
      description,
      icon,
    });

    await newIncome.save(); // Save the new user to the database

    return NextResponse.json(
      {success: "Income Added Successfully"},
      {status: 200}
    )
  } catch (error) {
    console.error("Error in CreateIncome API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
