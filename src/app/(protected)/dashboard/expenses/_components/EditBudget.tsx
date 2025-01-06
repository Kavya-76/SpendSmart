"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { IBudget, IBudgetExtended } from "@/models/Budget";

interface EditBudgetProps {
  budgetInfo: IBudgetExtended;
  refreshData: () => void;
}

const EditBudget : React.FC<EditBudgetProps> = ({ budgetInfo, refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [title, setTitle] = useState(String);
  const [amount, setAmount] = useState(Number);
  const [description, setDescription] = useState(String);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo.amount);
      setTitle(budgetInfo.title);
      setDescription(budgetInfo.description || "");
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    startTransition(() => {
      axios
        .post("/api/edit-budget", {
          icon: emojiIcon,
          title,
          amount,
          description,
        })
        .then((response) => {
          refreshData();
          toast("Budget Updated Successfully");
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
          <Button className="flex space-x-2 gap-2 rounded-full">
            {" "}
            <PenBox className="w-4" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    disabled={isPending}
                    placeholder="e.g. Home Decor"
                    defaultValue={budgetInfo.title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    disabled={isPending}
                    type="number"
                    defaultValue={budgetInfo?.amount}
                    placeholder="e.g. 5000$"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">
                    Budget Description
                  </h2>
                  <Input
                    disabled={isPending}
                    defaultValue={budgetInfo?.description}
                    placeholder=""
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(title && amount)}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full rounded-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBudget;
