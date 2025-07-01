import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
}

export const DateTimePicker = ({ date, onChange, label }: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [selectedTime, setSelectedTime] = useState<string>(
    date ? format(date, "HH:mm") : "12:00"
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      newDate.setHours(hours, minutes);
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    if (selectedDate) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onChange(newDate);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
          className="w-[150px]"
        />
      </div>
    </div>
  );
};