import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateTimePicker } from "./DateTimePicker";
import { Todo, EventFormData } from "./Types";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: EventFormData) => void;
  todos: Todo[];
  initialData?: Partial<EventFormData>;
}

export const EventForm = ({ isOpen, onClose, onSubmit, todos, initialData }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    description: initialData?.description ?? "",
    todoId: initialData?.todoId,
    allDay: initialData?.allDay ?? false,
    start: initialData?.start,
    end: initialData?.end,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <DateTimePicker
            date={formData.start}
            onChange={(date) => setFormData({ ...formData, start: date })}
            label="Start Time"
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={formData.allDay}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, allDay: checked as boolean })}
            />
            <Label htmlFor="allDay">All Day Event</Label>
          </div>

          {!formData.allDay && (
            <DateTimePicker
              date={formData.end}
              onChange={(date) => setFormData({ ...formData, end: date })}
              label="End Time"
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="todo">Associated Todo</Label>
            <Select
              value={formData.todoId}
              onValueChange={(value) => setFormData({ ...formData, todoId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a todo" />
              </SelectTrigger>
              <SelectContent>
                {todos.map((todo) => (
                  <SelectItem key={todo.id} value={todo.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: todo.color }}
                      />
                      <span>{todo.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};