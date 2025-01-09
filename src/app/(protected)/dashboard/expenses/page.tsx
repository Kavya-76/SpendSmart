"use client";
import React, { useEffect, useState } from "react";
import { IExpense } from "@/models/Expense";
import ExpenseList from "./_components/ExpenseList";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import ExpenseChart from "./_components/ExpenseChart";


const ExpensesPage = () => {
  const [expensesList, setExpensesList] = useState<IExpense[]>([]); // Explicitly typing the expenses list as an array of Expense objects
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  /**
   * Fetches all expenses belonging to the user
   */
  const getAllExpenses = async (): Promise<void> => {
    try {
      // Replace with the actual axios call to fetch expenses
      const response = await axios.get("/api/get-all-expenses"); // Assume endpoint here
      setExpensesList(response.data); // Assuming response data is in the shape of an array of expenses
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseChart expenses={expensesList} />
      <ExpenseList/>
    </div>
  );
};

export default ExpensesPage;
