import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  onConfirm: () => Promise<void>;
  btnTxt: string;
  title: string;
  description: string;
  waitingMsgContent: string;
  waitingMsgBtn: string;
}

export function ConfirmationDialog({ onConfirm, btnTxt, title, description, waitingMsgContent, waitingMsgBtn }: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleConfirm = async () => {
    setRemoving(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error in confirmation:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
          {btnTxt}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {removing
              ? waitingMsgContent
              : description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            disabled={removing}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={removing}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded"
          >
            {removing ? waitingMsgBtn : "Confirm"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}