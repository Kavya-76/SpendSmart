"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import ExpenseItem from "./ExpenseItem";
import { IExpense } from "@/models/Expense";
import axios from "axios";

const ExpenseList: React.FC = () => {
  const [expenseList, setExpenseList] = useState<IExpense[]>([]);
  const user = useCurrentUser();

  // Fetch expenses from API
  const getExpenseList = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<IExpense[]>("/api/get-all-expenses");
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, []);

  // Fetch expenses on user load
  useEffect(() => {
    if (user) {
      getExpenseList();
    }
  }, [user, getExpenseList]);

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {expenseList.length > 0
          ? expenseList.map((expense) => (
              <ExpenseItem expense={expense} key={String(expense._id)} />
            ))
          : [1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default ExpenseList;
