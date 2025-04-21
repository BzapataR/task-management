import { Paper, Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { Event } from "../types";
import dayjs from "dayjs";

interface CalendarViewProps {
  selectedDate: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs) => void;
  events: Event[];
}

const CalendarView = ({ selectedDate, onDateChange, events }: CalendarViewProps) => {
  const getEventsForDate = (date: dayjs.Dayjs) => {
    return events.filter((event) => event.date.date() === date.date() && event.date.month() === date.month() && event.date.year() === date.year());
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 0, overflow: "hidden", borderRadius: 3 }}>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Calendar
        </Typography>
      </Box>
      <Box sx={{ bgcolor: "background.paper", pt: 1 }}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          slots={{
            day: (props) => {
              const dateEvents = getEventsForDate(props.day);
              const hasEvents = dateEvents.length > 0;

              return (
                <div
                  onClick={props.onClick as any}
                  className={`relative flex cursor-pointer items-center justify-center ${
                    props.selected ? "rounded-full bg-blue-600 text-white" : ""
                  } ${props.disabled ? "text-gray-500" : ""} ${props.today && !props.selected ? "rounded-full border border-blue-500" : ""} h-10 w-10`}
                >
                  {props.day.date()}
                  {hasEvents && !props.selected && <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-blue-500"></div>}
                </div>
              );
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default CalendarView;
