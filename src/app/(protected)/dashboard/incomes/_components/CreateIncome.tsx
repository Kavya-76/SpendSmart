"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

interface CreateIncomeProps {
  refreshData: () => void;
}

const CreateIncome: React.FC<CreateIncomeProps> = ({ refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [createdAt, setCreatedAt] = useState<Date | undefined>();

  const onCreateIncome = async () => {
    startTransition(() => {
      axios
        .post("/api/create-income", {
          icon: emojiIcon,
          title,
          amount,
          description,
        })
        .then(() => {
          refreshData();
          toast.success("Income Added Successfully");
        })
        .catch((err) => {
          console.error("Error:", err);
          toast.error("Failed to add income. Please try again.");
        });
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-muted p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Add New Income</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Income</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-2">
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
                Income Name
              </Label>
              <Input
                id="title"
                placeholder="e.g. Home Decor"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                disabled={isPending}
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="amount" className="text-right">
                Income Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 5000"
                onChange={(e) => setAmount(Number(e.target.value))}
                value={amount || ""}
                disabled={isPending}
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="description" className="text-right">
                Income Description
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="Optional description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                disabled={isPending}
              />
            </div>
            <div className="mt-2">
              {/* <Label htmlFor="description" className="text-right">
                Income Description
              </Label> */}
              <DatePicker date={createdAt} setDate={setCreatedAt} />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(title && amount !== undefined && amount > 0)}
                onClick={onCreateIncome}
                className="mt-5 w-full rounded-full"
              >
                Add Income
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateIncome;
