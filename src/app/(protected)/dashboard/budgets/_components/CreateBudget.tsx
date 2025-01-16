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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

// Define the prop types for the CreateBudget component
interface CreateBudgetProps {
  refreshData: () => void;
}

const CreateBudget: React.FC<CreateBudgetProps> = ({ refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState<string>("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const onCreateBudget = async () => {
    startTransition(() => {
      axios
        .post("/api/create-budget", {
          icon: emojiIcon,
          title,
          amount,
          description,
        })
        .then(() => {
          refreshData(); // Call refreshData prop after budget creation
          toast("Budget Created Successfully");
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
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
              <Label htmlFor="title" className="text-right" >Budget Name</Label>
              <Input
                id="title"
                placeholder="e.g. Home Decor"
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="amount" className="text-right" >Budget Amount</Label>
              <Input
              id="amount"
                type="number"
                placeholder="e.g. 5000$"
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={isPending}
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="description" className="text-right" >Budget Description</Label>
              <Input
              id="description"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(title && amount)}
                onClick={onCreateBudget}
                className="mt-5 w-full rounded-full"
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
