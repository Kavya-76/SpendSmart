"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getBudgets } from "@/data/getBudgets";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";
import { IBudgetExtended } from "@/models/Budget";
import axios from "axios";

const BudgetList = () => {
  const [budgetList, setBudgetList] = useState<IBudgetExtended[]>([]);
  const user = useCurrentUser();
  
  useEffect(() => {
    user&&getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    if (user) {
      try {
        const response = await axios.get(`/api/get-budgets`)
        const budgets = response.data;
        setBudgetList(budgets)
      } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
      }
    }
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateBudget refreshData={() => getBudgetList()} />
        {budgetList.length > 0
          ? budgetList.map((budget) => (
              <BudgetItem budget={budget} key={budget._id} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
                h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default BudgetList;
