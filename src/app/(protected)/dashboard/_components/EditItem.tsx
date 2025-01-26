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
import { DatePicker } from "@/components/ui/date-picker";

interface EditProps {
  Info: {
    _id: string;
    icon: string;
    title: string;
    amount: number;
    description: string;
    createdAt: Date;
    type: string;
  };
  refreshData: () => void;
}

const EditItem: React.FC<EditProps> = ({ Info, refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState<string>("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | undefined>();
  const [isPending, startTransition] = useTransition();
  const type = Info.type.charAt(0).toUpperCase()+Info.type.slice(1);

  useEffect(() => {
    if (Info) {
      setEmojiIcon(Info.icon);
      setAmount(Info.amount);
      setTitle(Info.title);
      setDescription(Info.description || "");
      setCreatedAt(new Date(Info.createdAt));
      // setType(Info.type.charAt(0).toUpperCase()+Info.type.slice(1))
    }
  }, [Info]);

  const onUpdate = async () => {
    startTransition(() => {
      axios
        .put("/api/edit-item", {
          id: Info._id,
          icon: emojiIcon,
          title,
          amount,
          description,
          createdAt,
          type: Info.type,
        })
        .then(() => {
          refreshData();
          toast(`${type} Updated Successfully`);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
          <PenBox className="h-8 w-8 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update {type}</DialogTitle>
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
              {type} Name
            </Label>
            <Input
              id="title"
              value={title}
              disabled={isPending}
              placeholder="e.g. Home Decor"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="amount" className="text-right">
              {type} Amount
            </Label>
            <Input
              id="amount"
              value={amount || ""}
              disabled={isPending}
              type="number"
              placeholder="e.g. 5000$"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="description" className="text-right">
              {type} Description
            </Label>
            <Input
              id="description"
              value={description}
              disabled={isPending}
              placeholder="Add a description (optional)"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="date" className="text-right">
              {type} Date
            </Label>
            <div
              id="date"
            >
              {" "}
              
              <DatePicker date={createdAt} setDate={setCreatedAt} />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!(title && amount)}
              onClick={onUpdate}
              className="mt-5 w-full rounded-full"
            >
              Update {Info.type}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItem;
