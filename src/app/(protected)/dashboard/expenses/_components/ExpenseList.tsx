"use client";

import React from "react";
import ExpenseItem from "./ExpenseItem";
import { IExpense } from "@/models/Expense";

interface ExpenseListProps {
  filteredExpenses: IExpense[]; // Define the type for filteredExpenses
}

const ExpenseList: React.FC<ExpenseListProps> = ({ filteredExpenses }) => {
  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseItem expense={expense} key={String(expense._id)} />
          ))
        ) : (
          [1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
