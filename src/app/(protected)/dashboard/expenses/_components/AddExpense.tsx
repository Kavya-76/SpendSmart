import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import React, { useState, useEffect, useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import dynamic from "next/dynamic";

// EmojiPicker and other client-specific imports remain dynamically loaded
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
// Define props type for AddExpense component
interface AddExpenseProps {
  budgetId: string;
  refreshData: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ budgetId, refreshData }) => {
  const [isClient, setIsClient] = useState(false); // Ensure client-side rendering
  const [emojiIcon, setEmojiIcon] = useState<string>("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsClient(true); // Set true after hydration
  }, []);

  if (!isClient) {
    // Render fallback or nothing during SSR
    return null;
  }

  const addNewExpense = async () => {
    setLoading(true);
    startTransition(() => {
      axios
        .post("/api/create-expense", {
          icon: emojiIcon,
          title,
          amount,
          description,
          budgetId,
          createdAt: createdAt || new Date(),
        })
        .then(() => {
          setTitle("");
          setAmount(undefined);
          setDescription("");
          setCreatedAt(undefined);
          setEmojiIcon("😊");

          refreshData();
          toast("Expense Created Successfully");
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    });
  };

  return (
    <div className="border p-5 rounded-2xl dark:text-white">
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
        <Label htmlFor="title" className="text-right">
          Expense Name
        </Label>
        <Input
          id="title"
          disabled={isPending}
          placeholder="e.g. Bedroom Decor"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <Label htmlFor="amount" className="text-right">
          Expense Amount
        </Label>
        <Input
          id="amount"
          disabled={isPending}
          type="number"
          placeholder="e.g. 1000"
          value={amount !== undefined ? amount : ""} // Ensure it's always controlled
          onChange={(e) =>
            setAmount(e.target.value ? Number(e.target.value) : undefined)
          } // Handle type conversion
        />
      </div>
      <div className="mt-2">
        <Label htmlFor="description" className="text-right">
          Expense Description
        </Label>
        <Input
          id="description"
          placeholder="Add a description (optional)"
          disabled={isPending}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <Label htmlFor="date" className="text-right">
          Expense Date
        </Label>
        <div id="date">
          <DatePicker date={createdAt} setDate={setCreatedAt} />
        </div>
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
