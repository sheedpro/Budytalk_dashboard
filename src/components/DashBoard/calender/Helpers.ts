import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

export const generateId = () => crypto.randomUUID();

export const locales = {
  "en-US": enUS,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const statusColors: Record<string, string> = {
  shipped: "#bfdbfe",
  delivered: "#ddd6fe",
  cancelled: "#fecaca",
  pending: "#fef9c3",
  processing: "#fed7aa",
  completed: "#bbf7d0",
  default: "#e0e7ef",
};