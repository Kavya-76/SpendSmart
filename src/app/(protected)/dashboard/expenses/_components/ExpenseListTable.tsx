import { IExpense } from "@/models/Expense";
import React from "react";
import { toast } from "sonner";
import axios from "axios";

interface ExpenseListTableProps {
  expensesList: IExpense[];
  refreshData: () => void;
}

const ExpenseListTable: React.FC<ExpenseListTableProps> = ({
  expensesList,
  refreshData,
}) => {
  const deleteExpense = async (expense: IExpense) => {
    axios
      .delete(`/api/delete-expense/${expense._id}`)
      .then(() => {
        toast("Expense Deleted !");
        refreshData()
      })
      .catch((error) => {
        console.error("Error deleting expense: ", error);
        throw error;
      });
  };
  return (
    <div className="mt-5">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expense) => (
        <div
          className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
          key={String(expense._id)}
        >
          <h2>{expense.title}</h2>
          <h2>{expense.amount}</h2>
          <h2>{new Date(expense.createdAt).toLocaleDateString()}</h2>
          <h2
            onClick={() => deleteExpense(expense)}
            className="text-red-500 cursor-pointer"
          >
            Delete
          </h2>
        </div>
      ))}
    </div>
  );
};

export default ExpenseListTable;
