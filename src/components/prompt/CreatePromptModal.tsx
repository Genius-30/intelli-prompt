"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreatePromptModal({ open, onClose, onCreate }: Props) {
  const [promptTitle, setPromptTitle] = useState("");

  const handleSubmit = () => {
    if (promptTitle.trim()) {
      onCreate(promptTitle.trim());
      setPromptTitle("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Prompt Title"
          value={promptTitle}
          onChange={(e) => setPromptTitle(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
