import { useEffect, useState } from "react";
import { Calendar as BigCalendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequests } from "@/context/apiRequests";
import { EventForm } from "./calender/EventForm";
import { TodoForm } from "./calender/TodoForm";
import { SmallEvent } from "./calender/SmallEvent";
import { Todo, CalendarEvent, EventFormData } from "./calender/Types";
import { generateId, localizer, statusColors } from "./calender/Helpers";

export default function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventInfo, setShowEventInfo] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiRequests.post("order/all-orders");
        const orderEvents = response.data.data.map((order: any) => ({
          id: order.id,
          title: `Order #${order.id}`,
          description: `Order for ${order.customer?.first_name || "Customer"} (${order.status})`,
          start: new Date(order.delivery_date),
          end: new Date(order.delivery_date),
          allDay: true,
          status: order.status,
        }));
        setEvents(orderEvents);
      } catch (error) {
        // handle error
      }
    };
    fetchOrders();
  }, []);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventInfo(true);
  };

  const handleAddEvent = (formData: EventFormData) => {
    const newEvent: CalendarEvent = {
      id: generateId(),
      title: formData.description,
      description: formData.description,
      start: formData.start!,
      end: formData.allDay ? new Date(formData.start!.getTime() + 24 * 60 * 60 * 1000) : formData.end!,
      allDay: formData.allDay,
      todoId: formData.todoId,
    };
    setEvents([...events, newEvent]);
  };

  const handleAddTodo = (formData: Omit<Todo, "id">) => {
    const newTodo: Todo = {
      id: generateId(),
      ...formData,
    };
    setTodos([...todos, newTodo]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setShowEventInfo(false);
  };

  return (
    <Card className="max-w-7xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-muted-foreground">Manage your events and todos</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => setShowEventForm(true)}
            className="bg-[#50266f] text-white hover:bg-[#3e1f54]"
          >
            Add Event
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTodoForm(true)}
            className="border-[#50266f] text-[#50266f] hover:bg-[#50266f] hover:text-white"
          >
            Add Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          onSelectEvent={handleSelectEvent}
          components={{
            event: SmallEvent,
          }}
          eventPropGetter={(event) => {
            const color =
              event.status && statusColors[event.status]
                ? statusColors[event.status]
                : "#f3f4f6";
            return {
              style: {
                backgroundColor: color,
                borderRadius: "4px",
                color: "#22223b",
                border: "1px solid #cbd5e1",
                fontWeight: 500,
                minHeight: 20,
                padding: "0 2px",
              },
            };
          }}
        />

        <EventForm
          isOpen={showEventForm}
          onClose={() => setShowEventForm(false)}
          onSubmit={handleAddEvent}
          todos={todos}
        />

        <TodoForm
          isOpen={showTodoForm}
          onClose={() => setShowTodoForm(false)}
          onSubmit={handleAddTodo}
        />

        {selectedEvent && (
          <Dialog open={showEventInfo} onOpenChange={() => setShowEventInfo(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Event Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>{selectedEvent.description}</p>
                {selectedEvent.todoId && (
                  <Alert>
                    <AlertDescription>
                      Associated Todo: {todos.find(t => t.id === selectedEvent.todoId)?.title}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete Event
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEventInfo(false)}
                    className="border-[#50266f] text-[#50266f] hover:bg-[#50266f] hover:text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}