"use client";
import React, { useState, useEffect, useCallback } from "react";
import formatNumber from "@/lib/formatNumber";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  CircleDollarSign,
} from "lucide-react";
import { IBudgetExtended } from "@/models/Budget"; // Assuming this is the correct type
import { IIncome } from "@/models/Income"; // Assuming this is the correct type

// Define the props interface
interface CardInfoProps {
  budgetList: IBudgetExtended[];
  incomeList: IIncome[];
}

const CardInfo: React.FC<CardInfoProps> = ({ budgetList, incomeList }) => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  // Calculate card info from budgetList and incomeList
  const CalculateCardInfo = useCallback(() => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ += Number(element.amount);
      totalSpend_ += element.totalSpend;
    });

    incomeList.forEach((element) => {
      totalIncome_ += Number(element.amount);
    });

    setTotalIncome(totalIncome_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  }, [budgetList, incomeList]); // Recalculate when budgetList or incomeList changes

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList, CalculateCardInfo]); // Add CalculateCardInfo to the dependency array

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">${formatNumber(totalBudget)}</h2>
              </div>
              <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Spend</h2>
                <h2 className="font-bold text-2xl">${formatNumber(totalSpend)}</h2>
              </div>
              <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
              </div>
              <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Sum of Income Streams</h2>
                <h2 className="font-bold text-2xl">${formatNumber(totalIncome)}</h2>
              </div>
              <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardInfo;
