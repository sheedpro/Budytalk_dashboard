import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Todo } from "./Types";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Omit<Todo, "id">) => void;
}

export const TodoForm = ({ isOpen, onClose, onSubmit }: TodoFormProps) => {
  const [formData, setFormData] = useState({ title: "", color: "#4f46e5" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", color: "#4f46e5" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10 w-full"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#50266f] text-[#50266f] hover:bg-[#50266f] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#50266f] text-white hover:bg-[#3e1f54]"
            >
              Add Todo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};