import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import React, { useState, useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Define props type for AddExpense component
interface AddExpenseProps {
  budgetId: string;
  refreshData: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ budgetId, refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState<string>("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  /**
   * Used to Add New Expense
   */

  const addNewExpense = async () => {
    setLoading(true); // Show loader when starting the request
    startTransition(() => {
      axios
        .post("/api/create-expense", {
          icon: emojiIcon,
          title,
          amount,
          description,
          budgetId: budgetId,
          createdAt: createdAt || new Date(),
        })
        .then((response) => {
          refreshData();
          toast("Expense Created Successfully");
          setLoading(false); // Hide loader after successful request
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false); // Hide loader on error
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
          type="number"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Description</h2>
        <Input
          placeholder="Add a description (optional)"
          disabled={isPending}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Date</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !createdAt && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {createdAt ? format(createdAt, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={createdAt}
              onSelect={setCreatedAt}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button
        disabled={!(title && amount) || isPending}
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
