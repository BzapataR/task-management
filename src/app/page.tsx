// app/page.tsx
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
    Stack,
    IconButton,
    alpha,
    useMediaQuery,
} from "@mui/material";
import { Add, CalendarToday, FilterList } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

// Components
import Providers from "../components/Providers";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventForm from "../components/EventForm";
import EventCard from "../components/EventCard";
import CalendarView from "../components/CalendarView";
import UpcomingEvents from "../components/UpcomingEvents";

// Types & Utils
import { Event, SnackbarState } from "../types";
import {
    getEventsFromStorage,
    saveEventsToStorage,
    getEventsForDate,
    formatDateHeader,
    sortEventsByStartTime,
} from "./utils/eventStorage";

const drawerWidth = 240;

export default function Home() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
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
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Load events from localStorage on initial render
    useEffect(() => {
        const loadedEvents = getEventsFromStorage();
        setEvents(loadedEvents);
    }, []);

    // Update selected date events when date or events change
    useEffect(() => {
        if (selectedDate) {
            const dateEvents = getEventsForDate(events, selectedDate);
            setSelectedDateEvents(sortEventsByStartTime(dateEvents));
        }
    }, [selectedDate, events]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDateChange = (date: dayjs.Dayjs) => {
        setSelectedDate(date);
    };

    const handleAddEvent = () => {
        setEditingEvent(undefined);
        setIsFormOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    const handleSelectEvent = (event: Event) => {
        setSelectedDate(event.date);
        handleEditEvent(event);
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

    return (
        <Providers>
            <div className="min-h-screen bg-[#121212]">
                <Header
                    title="Event Dashboard"
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
                        p: 3,
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        mt: "64px",
                        minHeight: "calc(100vh - 64px)",
                    }}
                >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                        <Box
                            sx={{
                                width: { xs: "100%", md: "350px" },
                                position: { md: "sticky" },
                                top: { md: "80px" },
                                alignSelf: { md: "flex-start" },
                            }}
                        >
                            <CalendarView
                                selectedDate={selectedDate}
                                onDateChange={handleDateChange}
                                events={events}
                            />

                            <Box
                                sx={{
                                    mt: 3,
                                    display: { xs: "none", md: "block" },
                                }}
                            >
                                <UpcomingEvents
                                    events={events}
                                    onAddEvent={handleAddEvent}
                                    onSelectEvent={handleSelectEvent}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    mb: 3,
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    justifyContent: "space-between",
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    gap: { xs: 2, sm: 0 },
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {formatDateHeader(selectedDate)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        {selectedDateEvents.length} event
                                        {selectedDateEvents.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                        scheduled
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterList />}
                                        color="inherit"
                                        sx={{ borderColor: "divider" }}
                                    >
                                        Filter
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={handleAddEvent}
                                    >
                                        Add Event
                                    </Button>
                                </Box>
                            </Paper>

                            <Box sx={{ mt: 3 }}>
                                {selectedDateEvents.length === 0 ? (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            textAlign: "center",
                                            bgcolor: "background.paper",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: "50%",
                                                bgcolor: alpha(
                                                    theme.palette.primary.main,
                                                    0.1
                                                ),
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 auto",
                                                mb: 2,
                                            }}
                                        >
                                            <CalendarToday
                                                sx={{
                                                    fontSize: 32,
                                                    color: "primary.main",
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            No Events Scheduled
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 3 }}
                                        >
                                            There are no events scheduled for
                                            this date. Would you like to create
                                            a new event?
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={handleAddEvent}
                                        >
                                            Create Event
                                        </Button>
                                    </Paper>
                                ) : (
                                    <Stack spacing={2}>
                                        {selectedDateEvents.map((event) => (
                                            <EventCard
                                                key={event.id}
                                                event={event}
                                                onEdit={handleEditEvent}
                                                onDelete={handleDeleteEvent}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                {/* Mobile add button for small screens */}
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        display: { xs: "block", md: "none" },
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
            </div>
        </Providers>
    );
}
