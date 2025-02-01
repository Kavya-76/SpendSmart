import React, {useMemo} from "react";
import { GetFormatterForCurrency } from "@/lib/formatNumber";
import { IExpense } from "@/models/Expense"; // Import your IBudget interface

interface ExpenseItemProps {
  expense: IExpense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const formattedDate = expense.createdAt
    ? new Date(expense.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

    const userCurrency = "INR";
        const formatter = useMemo(
          () => GetFormatterForCurrency(userCurrency),
          [userCurrency]
        );

  return (
    <div className="p-5 border bg-red-500/10 rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {expense?.icon || "📊"}
          </h2>
          <div>
            <h2 className="font-bold">{expense.title}</h2>
            <h2 className="text-sm text-gray-500">Date: {formattedDate}</h2>
          </div>
        </div>
        <h2 className="font-bold text-red-500 text-lg">
        {formatter.format(expense.amount)}
        </h2>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="s">{expense.description}</h2>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
