import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import React, { useState, useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";

function AddExpense({ budgetId, refreshData }: any) {
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [title, setTitle] = useState(String);
  const [amount, setAmount] = useState(Number);
  const [description, setDescription] = useState(String);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  /**
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    startTransition(() => {
      axios
        .post("/api/create-expense", {
          icon: emojiIcon,
          title,
          amount,
          description,
          budgetId: budgetId
        })
        .then((response) => {
          refreshData();
          toast("Expense Created Successfully");
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <Button
        variant="outline"
        className="text-lg"
        onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
      >
        {emojiIcon}
      </Button>
      {openEmojiPicker && (
        <div className="absolute z-20">
          <EmojiPicker
            onEmojiClick={(e) => { 
              setEmojiIcon(e.emoji);
              setOpenEmojiPicker(false);
            }}
          />
        </div>
      )}
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          disabled={isPending}
          placeholder="e.g. Bedroom Decor"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          disabled={isPending}
          type="Number"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Description</h2>
        <Input
          disabled={isPending}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button
        disabled={!(title && amount) || isPending}
        onClick={() => addNewExpense()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
