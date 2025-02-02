import React,{useMemo} from "react";
import Link from "next/link";
import { IBudget } from "@/models/Budget"; // Import your IBudget interface
import { GetFormatterForCurrency } from "@/lib/formatNumber";

interface BudgetItemProps {
  budget: IBudget & {
    totalSpend: number;
    totalItem: number;
  };
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget }) => {
  const calculateProgressPerc = (): string => {
    const spend = budget.totalSpend || 0;
    const perc = (spend / budget.amount) * 100;
    return perc > 100 ? "100" : perc.toFixed(2);
  };

  const userCurrency = "INR";
  const formatter = useMemo(
    () => GetFormatterForCurrency(userCurrency),
    [userCurrency]
  );

  return (
    <Link href={`/dashboard/expenses/${budget?._id}`}>
      <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
              {budget?.icon || "📊"}
            </h2>
            <div>
              <h2 className="font-bold">{budget.title}</h2>
              <h2 className="text-sm text-gray-500">
                {budget.totalItem || 0} Item{budget.totalItem !== 1 ? "s" : ""}
              </h2>
            </div>
          </div>
          <h2 className="font-bold text-primary text-lg">
            {formatter.format(budget.amount)}
          </h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
              ₹{budget.totalSpend?.toLocaleString() || "0"} Spend
            </h2>
            <h2 className="text-xs text-slate-400">
              ₹{(budget.amount - (budget.totalSpend || 0)).toLocaleString()}{" "}
              Remaining
            </h2>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-800 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full"
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BudgetItem;
