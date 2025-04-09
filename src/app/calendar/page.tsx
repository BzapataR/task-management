// app/calendar/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
    Box,
    Drawer,
    Paper,
    Typography,
    Button,
    Snackbar,
    Alert,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

// Components
import Providers from "../../components/Providers";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import EventForm from "../../components/EventForm";

// Types & Utils
import { Event, SnackbarState } from "../../types";
import {
    getEventsFromStorage,
    saveEventsToStorage,
} from "../utils/eventStorage";

const drawerWidth = 240;

export default function CalendarPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
    const [events, setEvents] = useState<Event[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | undefined>(
        undefined
    );
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Load events from localStorage on initial render
    useEffect(() => {
        const loadedEvents = getEventsFromStorage();
        setEvents(loadedEvents);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDateSelect = (date: dayjs.Dayjs) => {
        setSelectedDate(date);
        setIsFormOpen(true);
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

    const handleEditEvent = (event: Event) => {
        setSelectedDate(event.date);
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    const handleDeleteEvent = (id: string) => {
        const newEvents = events.filter((event) => event.id !== id);
        setEvents(newEvents);
        saveEventsToStorage(newEvents);

        setSnackbar({
            open: true,
            message: "Event deleted successfully",
            severity: "success",
        });
    };

    const handleSaveEvent = (event: Event) => {
        let newEvents: Event[];

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

    // Get events for a specific day
    const getEventsForDay = (day: number) => {
        return events.filter(
            (event) =>
                event.date.date() === day &&
                event.date.month() === currentMonth.month() &&
                event.date.year() === currentMonth.year()
        );
    };

    // Calendar generation functions
    const getDaysInMonth = () => {
        return currentMonth.daysInMonth();
    };

    const getStartDayOfMonth = () => {
        return currentMonth.startOf("month").day(); // 0 = Sunday, 1 = Monday, etc.
    };

    // Render calendar
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth();
        const startDay = getStartDayOfMonth();
        const days = [];
        const today = dayjs();

        // Create header row with day names
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

        // Calculate total number of weeks needed
        let dayCount = 1;
        let weekRows = [];

        // Generate weeks until we've displayed all days
        while (dayCount <= daysInMonth) {
            let week = [];

            // Fill each week with 7 days
            for (let i = 0; i < 7; i++) {
                // Padding for first week
                if (dayCount === 1 && i < startDay) {
                    week.push(
                        <td
                            key={`empty-${i}`}
                            className="calendar-day empty"
                        ></td>
                    );
                }
                // Actual days of the month
                else if (dayCount <= daysInMonth) {
                    const currentDate = currentMonth.date(dayCount);
                    const isToday = currentDate.isSame(today, "day");
                    const dayEvents = getEventsForDay(dayCount);

                    week.push(
                        <td
                            key={dayCount}
                            className={`calendar-day ${isToday ? "today" : ""}`}
                            onClick={() => handleDateSelect(currentDate)}
                        >
                            <div className="day-number">{dayCount}</div>
                            <div className="day-events">
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-item"
                                        style={{
                                            backgroundColor:
                                                event.color || "#3b82f6",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditEvent(event);
                                        }}
                                    >
                                        {event.startTime.format("h:mm A")}{" "}
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </td>
                    );

                    dayCount++;
                }
                // Padding for last week
                else {
                    week.push(
                        <td
                            key={`empty-end-${i}`}
                            className="calendar-day empty"
                        ></td>
                    );
                }
            }

            weekRows.push(<tr key={`week-${weekRows.length}`}>{week}</tr>);
        }

        days.push(...weekRows);
        return days;
    };

    return (
        <Providers>
            <div className="min-h-screen bg-[#121212]">
                <Header
                    title="Calendar"
                    onMenuClick={handleDrawerToggle}
                    onAddClick={handleAddEvent}
                />

                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                >
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
                        <Sidebar
                            isMobile={true}
                            setMobileOpen={setMobileOpen}
                        />
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
                                alignItems: { xs: "center", sm: "center" },
                                mb: 2,
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {currentMonth.format("MMMM YYYY")}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: { xs: "wrap", sm: "nowrap" },
                                    justifyContent: {
                                        xs: "center",
                                        sm: "flex-end",
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton
                                        onClick={() =>
                                            handleMonthChange("prev")
                                        }
                                        color="primary"
                                        size="small"
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            handleMonthChange("next")
                                        }
                                        color="primary"
                                        size="small"
                                    >
                                        <ChevronRight />
                                    </IconButton>
                                </Box>

                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={handleAddEvent}
                                >
                                    Add Event
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
                        <div className="calendar-container">
                            <table className="calendar">
                                <tbody>{renderCalendar()}</tbody>
                            </table>
                        </div>
                    </Paper>
                </Box>

                {/* Event Form Modal */}
                <EventForm
                    open={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveEvent}
                    event={editingEvent}
                    selectedDate={selectedDate}
                />

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            "& .MuiAlert-icon": {
                                color:
                                    snackbar.severity === "success"
                                        ? "#22c55e"
                                        : "#ef4444",
                            },
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* CSS Styles for Calendar */}
                <style jsx global>{`
                    .calendar-container {
                        width: 100%;
                        overflow-x: auto;
                    }

                    .calendar {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                    }

                    .calendar th {
                        padding: 12px 0;
                        text-align: center;
                        background-color: #1e1e1e;
                        color: #fff;
                        font-weight: 600;
                        border: 1px solid #333;
                    }

                    .calendar-day {
                        position: relative;
                        height: 120px;
                        width: calc(100% / 7);
                        vertical-align: top;
                        padding: 8px;
                        border: 1px solid #333;
                        background-color: #1a1a1a;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }

                    .calendar-day:hover {
                        background-color: #2a2a2a;
                    }

                    .calendar-day.today {
                        background-color: rgba(59, 130, 246, 0.1);
                    }

                    .calendar-day.empty {
                        background-color: #171717;
                        cursor: default;
                    }

                    .day-number {
                        text-align: right;
                        font-size: 14px;
                        margin-bottom: 6px;
                        font-weight: 500;
                    }

                    .today .day-number {
                        color: #3b82f6;
                        font-weight: 700;
                    }

                    .day-events {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        overflow: hidden;
                    }

                    .event-item {
                        font-size: 12px;
                        padding: 2px 6px;
                        border-radius: 4px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: white;
                        cursor: pointer;
                    }

                    @media (max-width: 600px) {
                        .calendar-day {
                            height: 100px;
                            padding: 4px;
                        }

                        .day-number {
                            font-size: 12px;
                            margin-bottom: 4px;
                        }

                        .event-item {
                            font-size: 10px;
                            padding: 1px 4px;
                        }
                    }
                `}</style>
            </div>
        </Providers>
    );
}
