import React from "react";
import { IIncome } from "@/models/Income"; // Import your IIncome interface

interface IncomeItemProps {
  income: IIncome; // Explicitly define the prop type
}

const IncomeItem: React.FC<IncomeItemProps> = ({ income }) => {
  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {income.icon || "📊"}
          </h2>
          <div>
            <h2 className="font-bold">{income.title}</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">
          ₹{income.amount.toLocaleString()}
        </h2>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="s">{income.description}</h2>
        </div>
      </div>
    </div>
  );
};

export default IncomeItem;
