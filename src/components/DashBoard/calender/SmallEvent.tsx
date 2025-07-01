import { CalendarEvent } from "./Types";

interface SmallEventProps {
  event: CalendarEvent;
}

export const SmallEvent = ({ event }: SmallEventProps) => (
  <div style={{ fontSize: 12, padding: "2px 6px" }}>
    {event.title}
  </div>
);