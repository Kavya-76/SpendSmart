import { IExpense } from "@/models/Expense";
import { Key, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ExpenseListTableProps {
  expensesList: IExpense[];
  refreshData: () => void;
}

const ExpenseListTable:React.FC<ExpenseListTableProps> = ({expensesList, refreshData}) => {
  // const deleteExpense = async (expense) => {
  //   const result = await db
  //     .delete(Expenses)
  //     .where(eq(Expenses.id, expense.id))
  //     .returning();

  //   if (result) {
  //     toast("Expense Deleted!");
  //     refreshData();
  //   }
  // };
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expense, index) => (
        <div className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2" key={String(expense._id)}>
          <h2>{expense.title}</h2>
          <h2>{expense.amount}</h2>
          <h2>{new Date(expense.createdAt).toLocaleDateString()}</h2>
          {/* <h2
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer"
          >
            Delete
          </h2> */}
          {/* <h2>
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() => deleteExpense(expenses)}
            />
          </h2> */}
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;