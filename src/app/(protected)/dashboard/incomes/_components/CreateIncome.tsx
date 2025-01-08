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
import { toast } from "sonner";
import axios from "axios";

const CreateIncome = ({ refreshData }: any) => {
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [title, setTitle] = useState(String);
  const [amount, setAmount] = useState(Number);
  const [description, setDescription] = useState(String);

  const [isPending, startTransition] = useTransition();

  const onCreateIncome = async () => {
    startTransition(() => {
      axios
        .post("/api/create-income", {
          icon: emojiIcon,
          title,
          amount,
          description,
        })
        .then((response) => {
          refreshData()
          toast("Income Added Successfully");
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
          <div
            className="bg-slate-100 p-10 rounded-2xl
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
            <DialogDescription>
              <div className="mt-5">
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
                  <h2 className="text-black font-medium my-1">Income Name</h2>
                  <Input
                    placeholder="e.g. Home Decor"
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Income Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 5000$"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    disabled={isPending}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">
                    Income Description
                  </h2>
                  <Input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(title && amount)}
                onClick={() => onCreateIncome()}
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