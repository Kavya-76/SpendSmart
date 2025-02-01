import React,{useMemo} from "react";
import { IIncome } from "@/models/Income"; // Import your IBudget interface
import { GetFormatterForCurrency } from "@/lib/formatNumber";

interface IncomeItemProps {
  income: IIncome;
}

const IncomeItem: React.FC<IncomeItemProps> = ({ income }) => {
  const formattedDate = income.createdAt
    ? new Date(income.createdAt).toLocaleDateString("en-GB", {
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
    <div className="p-5 border bg-emerald-500/10 rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {income?.icon || "📊"}
          </h2>
          <div>
            <h2 className="font-bold">{income.title}</h2>
            <h2 className="text-sm text-gray-500">Date: {formattedDate}</h2>
          </div>
        </div>
        <h2 className="font-bold text-emerald-500 text-lg">
        {formatter.format(income.amount)}
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
