"use client";
import React, { useMemo } from "react";
import {
  PiggyBank,
  Wallet,
  TrendingUp,
  TrendingDownIcon,
  ReceiptText,
} from "lucide-react";
import { GetFormatterForCurrency } from "@/lib/formatNumber";
import CountUp from "react-countup";

// Define the props interface
interface CardInfoProps {
  totalBudgets: number;
  totalBudgetAmount: number;
  totalExpenseAmount: number;
  totalIncomeAmount: number;
}

const CardInfo: React.FC<CardInfoProps> = ({ totalBudgets, totalBudgetAmount, totalExpenseAmount, totalIncomeAmount }) => {
  const userCurrency = "USD";
  const formatter = useMemo(
    () => GetFormatterForCurrency(userCurrency),
    [userCurrency]
  );

  return (
    <div>
        <div>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Income</h2>
                <h2 className="font-bold text-2xl">
                  <CountUp
                    duration={0.5}
                    preserveValue
                    end={totalIncomeAmount}
                    decimals={0}
                    formattingFn={formatter.format}
                  />
                </h2>
              </div>
              <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Spend</h2>
                <h2 className="font-bold text-2xl">
                  {/* ${formatNumber(totalSpend)} */}
                  <CountUp
                    duration={0.5}
                    preserveValue
                    end={totalExpenseAmount}
                    decimals={0}
                    formattingFn={formatter.format}
                  />
                </h2>
              </div>
              <TrendingDownIcon className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Balance</h2>
                <h2 className="font-bold text-2xl">
                  <CountUp
                    duration={0.5}
                    preserveValue
                    end={totalIncomeAmount - totalExpenseAmount}
                    decimals={0}
                    formattingFn={formatter.format}
                  />
                </h2>
              </div>
              <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">
                <CountUp
                    duration={0.5}
                    preserveValue
                    end={totalBudgetAmount}
                    decimals={0}
                    formattingFn={formatter.format}
                  />
                </h2>
              </div>
              <PiggyBank className="h-12 w-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl"><CountUp
                    duration={0.5}
                    preserveValue
                    end={totalBudgets}
                    decimals={0}
                    // formattingFn={formatter.format}
                  /></h2>
              </div>
              <ReceiptText className="h-12 w-12 items-center rounded-lg p-2 text-gray-500 bg-gray-400/10" />
            </div>
          </div>
        </div>
    </div>
  );
};

export default CardInfo;
