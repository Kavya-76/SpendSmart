"use client"
import React, {useState, useEffect} from "react";
import BudgetList from "./_components/BudgetList";
import { IBudgetExtended } from "@/models/Budget";
import BarChartDashboard from "../_components/BarChartDashboard";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";

const BudgetsPage = () => {
  const [budgetList, setBudgetList] = useState<IBudgetExtended[]>([]);
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async (): Promise<void> => {
    try {
      const response = await axios("/api/get-budgets");
      setBudgetList(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Budgets</h2>
      <BarChartDashboard budgetList={budgetList} />
      <BudgetList />
    </div>
  );
};

export default BudgetsPage;
