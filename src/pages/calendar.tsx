import { useState, useEffect } from "react";
import { Box, Drawer, Paper, Typography, Button, Snackbar, Alert, IconButton, useMediaQuery } from "@mui/material";
import { Add, ChevronLeft, ChevronRight, Event, CalendarViewDay } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import Providers from "@components/Providers";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import EventForm from "@components/EventForm";
import { Event as EventType, SnackbarState } from "@types";
import { getEventsFromStorage, saveEventsToStorage, formatDateHeader } from "@/utils/eventStorage";

const drawerWidth = 240;

export default function CalendarPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [events, setEvents] = useState<EventType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setViewMode(isMobile ? "list" : "month");
  }, [isMobile]);

  useEffect(() => {
    const loadedEvents = getEventsFromStorage();
    setEvents(loadedEvents);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMonthChange = (type: "prev" | "next") => {
    if (type === "prev") {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    } else {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: EventType) => {
    setSelectedDate(event.date);
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = (event: EventType) => {
    let newEvents: EventType[];

    if (editingEvent) {
      newEvents = events.map((e) => (e.id === event.id ? event : e));
      setSnackbar({
        open: true,
        message: "Event updated successfully",
        severity: "success",
      });
    } else {
      newEvents = [...events, event];
      setSnackbar({
        open: true,
        message: "Event added successfully",
        severity: "success",
      });
    }

    setEvents(newEvents);
    saveEventsToStorage(newEvents);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.date.date() === day && event.date.month() === currentMonth.month() && event.date.year() === currentMonth.year());
  };

  const getDaysInMonth = () => {
    return currentMonth.daysInMonth();
  };

  const getStartDayOfMonth = () => {
    return currentMonth.startOf("month").day();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "month" ? "list" : "month");
  };

  const renderCalendarMonthView = () => {
    const daysInMonth = getDaysInMonth();
    const startDay = getStartDayOfMonth();
    const days = [];
    const today = dayjs();

    const headerRow = (
      <tr key="header">
        <th>Sun</th>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
      </tr>
    );
    days.push(headerRow);

    let dayCount = 1;
    let weekRows = [];

    while (dayCount <= daysInMonth) {
      let week = [];

      for (let i = 0; i < 7; i++) {
        if (dayCount === 1 && i < startDay) {
          week.push(<td key={`empty-${i}`} className="calendar-day empty"></td>);
        } else if (dayCount <= daysInMonth) {
          const currentDate = currentMonth.date(dayCount);
          const isToday = currentDate.isSame(today, "day");
          const isSelected = currentDate.isSame(selectedDate, "day");
          const dayEvents = getEventsForDay(dayCount);

          week.push(
            <td key={dayCount} className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`} onClick={() => setSelectedDate(currentDate)}>
              <div className="day-number">{dayCount}</div>
              <div className="day-events">
                {dayEvents.length > 0 && (
                  <>
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="event-item"
                        style={{
                          backgroundColor: event.color || "#3b82f6",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                      >
                        {isMobile ? "" : `${event.startTime.format("h:mm A")} `}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div
                        className="more-events"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(currentDate);
                        }}
                      >
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </>
                )}
              </div>
            </td>
          );

          dayCount++;
        } else {
          week.push(<td key={`empty-end-${i}`} className="calendar-day empty"></td>);
        }
      }

      weekRows.push(<tr key={`week-${weekRows.length}`}>{week}</tr>);
    }

    days.push(...weekRows);
    return days;
  };

  const renderCalendarListView = () => {
    const daysInMonth = getDaysInMonth();
    const daysList = [];
    const today = dayjs();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = currentMonth.date(day);
      const isToday = currentDate.isSame(today, "day");
      const isSelected = currentDate.isSame(selectedDate, "day");
      const dayEvents = getEventsForDay(day);

      if (dayEvents.length > 0) {
        daysList.push(
          <div key={`day-${day}`} className={`list-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`} onClick={() => setSelectedDate(currentDate)}>
            <div className="list-day-header">
              <Typography variant="subtitle1" fontWeight={600}>
                {currentDate.format("ddd, MMM D")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
              </Typography>
            </div>

            <div className="list-day-events">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="list-event-item"
                  style={{
                    borderLeftColor: event.color || "#3b82f6",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event);
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.startTime.format("h:mm A")} - {event.endTime.format("h:mm A")}
                  </Typography>
                  {event.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {event.location}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    if (daysList.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">No events this month</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddEvent} sx={{ mt: 2 }}>
            Add Event
          </Button>
        </Box>
      );
    }

    return daysList;
  };

  return (
    <Providers>
      <div className="min-h-screen bg-[#121212]">
        <Header title="Calendar" onMenuClick={handleDrawerToggle} onAddClick={handleAddEvent} />

        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "#1a1a1a",
              },
            }}
          >
            <Sidebar isMobile={true} setMobileOpen={setMobileOpen} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "#1a1a1a",
                borderRight: "1px solid",
                borderColor: "divider",
              },
            }}
            open
          >
            <Sidebar isMobile={false} />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            mt: "64px",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                mb: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {currentMonth.format("MMMM YYYY")}
                </Typography>

                {isMobile && (
                  <Box sx={{ display: "flex" }}>
                    <IconButton onClick={() => handleMonthChange("prev")} color="primary" size="small">
                      <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={() => handleMonthChange("next")} color="primary" size="small">
                      <ChevronRight />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: { xs: "nowrap", sm: "nowrap" },
                  justifyContent: "space-between",
                }}
              >
                <Button variant="outlined" startIcon={viewMode === "month" ? <CalendarViewDay /> : <Event />} onClick={toggleViewMode} sx={{ display: { xs: "flex", md: "flex" } }}>
                  {viewMode === "month" ? "List View" : "Month View"}
                </Button>

                {!isMobile && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleMonthChange("prev")} color="primary" size="small">
                      <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={() => handleMonthChange("next")} color="primary" size="small">
                      <ChevronRight />
                    </IconButton>
                  </Box>
                )}

                <Button variant="contained" startIcon={<Add />} onClick={handleAddEvent} sx={{ display: { xs: "none", sm: "flex" } }}>
                  Add Event
                </Button>
              </Box>
            </Box>
          </Paper>

          {isMobile && (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: { xs: "block", sm: "block" } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{formatDateHeader(selectedDate)}</Typography>
                <Button variant="outlined" size="small" onClick={() => setIsFormOpen(true)}>
                  Add
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {getEventsForDay(selectedDate.date()).length} event{getEventsForDay(selectedDate.date()).length !== 1 ? "s" : ""}
              </Typography>
            </Paper>
          )}

          <Paper sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
            {viewMode === "month" ? (
              <div className="calendar-container">
                <table className="calendar">
                  <tbody>{renderCalendarMonthView()}</tbody>
                </table>
              </div>
            ) : (
              <div className="calendar-list-view">{renderCalendarListView()}</div>
            )}
          </Paper>
        </Box>

        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "block", sm: "none" },
            zIndex: 1000,
          }}
        >
          <IconButton
            color="primary"
            onClick={handleAddEvent}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              width: 56,
              height: 56,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Add fontSize="medium" />
          </IconButton>
        </Box>

        <EventForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSaveEvent} event={editingEvent} selectedDate={selectedDate} />

        <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              "& .MuiAlert-icon": {
                color: snackbar.severity === "success" ? "#22c55e" : "#ef4444",
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </Providers>
  );
}
