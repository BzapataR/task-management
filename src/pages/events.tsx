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
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  alpha,
} from "@mui/material";
import { Search, Add, FilterList, CalendarToday, AccessTime, SortByAlpha, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import Providers from "@components/Providers";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import EventForm from "@components/EventForm";
import EventCard from "@components/EventCard";
import { Event, SnackbarState } from "@types";
import { getEventsFromStorage, saveEventsToStorage, eventColors } from "../utils/eventStorage";

const drawerWidth = 240;

export default function EventsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedColorFilters, setSelectedColorFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    const loadedEvents = getEventsFromStorage();
    setEvents(loadedEvents);
  }, []);

  useEffect(() => {
    let result = [...events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) => event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query) || event.location.toLowerCase().includes(query));
    }

    if (timeFilter === "upcoming") {
      result = result.filter((event) => dayjs().isBefore(event.date) || (dayjs().isSame(event.date, "day") && dayjs().isBefore(event.startTime)));
    } else if (timeFilter === "past") {
      result = result.filter((event) => dayjs().isAfter(event.date) || (dayjs().isSame(event.date, "day") && dayjs().isAfter(event.endTime)));
    } else if (timeFilter === "today") {
      result = result.filter((event) => dayjs().isSame(event.date, "day"));
    }

    if (selectedColorFilters.length > 0) {
      result = result.filter((event) => selectedColorFilters.includes(event.color || eventColors[0]));
    }

    if (sortOrder === "newest") {
      result.sort((a, b) => {
        if (a.date.isSame(b.date, "day")) {
          return a.startTime.isBefore(b.startTime) ? -1 : 1;
        }
        return a.date.isBefore(b.date) ? -1 : 1;
      });
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => {
        if (a.date.isSame(b.date, "day")) {
          return a.startTime.isBefore(b.startTime) ? -1 : 1;
        }
        return a.date.isBefore(b.date) ? 1 : -1;
      });
    } else if (sortOrder === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredEvents(result);
  }, [events, searchQuery, timeFilter, sortOrder, selectedColorFilters]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const handleColorFilterToggle = (color: string) => {
    if (selectedColorFilters.includes(color)) {
      setSelectedColorFilters(selectedColorFilters.filter((c) => c !== color));
    } else {
      setSelectedColorFilters([...selectedColorFilters, color]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setTimeFilter("all");
    setSortOrder("newest");
    setSelectedColorFilters([]);
  };

  return (
    <Providers>
      <div className="min-h-screen bg-[#121212]">
        <Header title="All Events" onMenuClick={handleDrawerToggle} onAddClick={handleAddEvent} />

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
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            mt: "64px",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Events
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleAddEvent}>
                Add Event
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              <TextField
                fullWidth
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              <Button variant={showFilters ? "contained" : "outlined"} startIcon={<FilterList />} onClick={() => setShowFilters(!showFilters)} sx={{ minWidth: "120px" }}>
                Filters
              </Button>
            </Box>

            {showFilters && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Filter & Sort
                  </Typography>
                  <Button size="small" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: {
                      xs: "center",
                      sm: "flex-start",
                    },
                  }}
                >
                  <FormControl size="small" sx={{ minWidth: "120px" }}>
                    <InputLabel>Time</InputLabel>
                    <Select value={timeFilter} label="Time" onChange={(e) => setTimeFilter(e.target.value)} startAdornment={<AccessTime fontSize="small" sx={{ mr: 1 }} />}>
                      <MenuItem value="all">All Events</MenuItem>
                      <MenuItem value="upcoming">Upcoming</MenuItem>
                      <MenuItem value="past">Past</MenuItem>
                      <MenuItem value="today">Today</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: "150px" }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortOrder} label="Sort By" onChange={(e) => setSortOrder(e.target.value)} startAdornment={<SortByAlpha fontSize="small" sx={{ mr: 1 }} />}>
                      <MenuItem value="newest">Date (Newest)</MenuItem>
                      <MenuItem value="oldest">Date (Oldest)</MenuItem>
                      <MenuItem value="alphabetical">Title (A-Z)</MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      alignItems: "center",
                      ml: { xs: 0, md: 2 },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Color:
                    </Typography>
                    {eventColors.map((color) => (
                      <Chip
                        key={color}
                        label=""
                        sx={{
                          bgcolor: color,
                          border: selectedColorFilters.includes(color) ? "2px solid white" : "none",
                          "&:hover": {
                            bgcolor: alpha(color, 0.8),
                          },
                        }}
                        onClick={() => handleColorFilterToggle(color)}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredEvents.length} of {events.length} events
                {selectedColorFilters.length > 0 && " • Filtered by color"}
                {timeFilter !== "all" && ` • ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} events`}
                {searchQuery && ` • Search: "${searchQuery}"`}
              </Typography>
            </Box>

            {filteredEvents.length === 0 ? (
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
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
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
                  No Events Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {events.length === 0 ? "You haven't created any events yet." : "No events match your current filters. Try adjusting your search criteria."}
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleAddEvent}>
                  Create Event
                </Button>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                ))}
              </Stack>
            )}
          </Paper>
        </Box>

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
