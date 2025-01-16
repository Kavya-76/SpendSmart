import { IBudgetExtended } from "@/models/Budget";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { PenBox } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface EditBudgetProps {
  budgetInfo: IBudgetExtended;
  refreshData: () => void;
}

const EditBudget: React.FC<EditBudgetProps> = ({ budgetInfo, refreshData }) => {
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
        .put("/api/edit-budget", {
          id: budgetInfo._id,
          icon: emojiIcon,
          title,
          amount,
          description,
        })
        .then(() => {
          refreshData();
          toast("Budget Updated Successfully");
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex space-x-2 gap-2 rounded-full">
          {" "}
          <PenBox className="w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
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
            <Label htmlFor="title" className="text-right" >Budget Name</Label>
            <Input
                id="title"
              disabled={isPending}
              placeholder="e.g. Home Decor"
              defaultValue={budgetInfo.title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="amount" className="text-right" >Budget Amount</Label>
            <Input
            id="amount"
              disabled={isPending}
              type="number"
              defaultValue={budgetInfo?.amount}
              placeholder="e.g. 5000$"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="description" className="text-right" >Budget Description</Label>
            <Input
            id="description"
              disabled={isPending}
              defaultValue={budgetInfo?.description}
              placeholder="Add a description (optional)"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
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
  );
};

export default EditBudget;
