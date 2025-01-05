"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getBudgets } from "@/data/getBudgets";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";
import { IBudgetExtended } from "@/models/Budget";

const BudgetList = () => {
  const [budgetList, setBudgetList] = useState<IBudgetExtended[]>([]);
  const user = useCurrentUser();
  
  useEffect(() => {
    console.log("Fetching budgets");
    
    const fetchBudgets = async () => {
      if (user) {
        try {
          const budgets = await getBudgets(user._id); // Call server-side utility via an endpoint
          setBudgetList(budgets);
        } catch (error) {
          console.error("Error fetching budgets:", error);
        }
      }
    };

    fetchBudgets();
  }, [user]);

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateBudget refreshData={() => {}} />
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
