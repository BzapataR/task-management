import { Paper, Box, Typography, Button, Divider } from "@mui/material";
import { Add, CalendarToday } from "@mui/icons-material";
import { Event } from "@types";
import { getUpcomingEvents } from "../utils/eventStorage";

interface UpcomingEventsProps {
  events: Event[];
  onAddEvent: () => void;
  onSelectEvent: (event: Event) => void;
}

const UpcomingEvents = ({ events, onAddEvent, onSelectEvent }: UpcomingEventsProps) => {
  const upcomingEvents = getUpcomingEvents(events, 3);

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Quick Actions
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="contained" color="primary" sx={{ mb: 2 }} startIcon={<Add />} onClick={onAddEvent}>
          Create Event
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Upcoming Events
        </Typography>

        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <Box
              key={event.id}
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderLeft: "4px solid",
                borderLeftColor: event.color || "primary.main",
                "&:hover": {
                  bgcolor: "action.hover",
                  cursor: "pointer",
                },
              }}
              onClick={() => onSelectEvent(event)}
            >
              <Typography variant="subtitle2" noWrap>
                {event.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 0.5,
                }}
              >
                <CalendarToday fontSize="inherit" sx={{ mr: 0.5 }} />
                {event.date.format("MMM D")} • {event.startTime.format("h:mm A")}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No upcoming events
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default UpcomingEvents;
