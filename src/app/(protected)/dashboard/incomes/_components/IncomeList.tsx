"use client";

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import CreateIncome from "./CreateIncome";
import IncomeItem from "./IncomeItem";
import { IIncome } from "@/models/Income";
import axios from "axios";

const IncomeList: React.FC = () => {
  const [incomeList, setIncomeList] = useState<IIncome[]>([]);
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      getIncomeList();
    }
  }, [user]);

  const getIncomeList = async (): Promise<void> => {
    try {
      const response = await axios.get<IIncome[]>("/api/get-incomes");
      setIncomeList(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncome refreshData={getIncomeList} />
        {incomeList.length > 0
          ? incomeList.map((income) => (
              <IncomeItem income={income} key={String(income._id)} />
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

export default IncomeList;
