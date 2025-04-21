import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Box, Divider } from "@mui/material";
import { Close, LocationOn, EventNote } from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Event, EventFormProps } from "../types";
import { eventColors } from "../utils/eventStorage";

const EventForm = ({ open, onClose, onSave, event, selectedDate }: EventFormProps) => {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || selectedDate);
  const [location, setLocation] = useState(event?.location || "");
  const [startTime, setStartTime] = useState(event?.startTime || dayjs().hour(9).minute(0).second(0));
  const [endTime, setEndTime] = useState(event?.endTime || dayjs().hour(10).minute(0).second(0));
  const [color, setColor] = useState(event?.color || eventColors[0]);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(event?.title || "");
      setDescription(event?.description || "");
      setDate(event?.date || selectedDate);
      setLocation(event?.location || "");
      setStartTime(event?.startTime || dayjs().hour(9).minute(0).second(0));
      setEndTime(event?.endTime || dayjs().hour(10).minute(0).second(0));
      setColor(event?.color || eventColors[0]);
      setTitleError(false);
    }
  }, [open, event, selectedDate]);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const newEvent: Event = {
      id: event?.id || crypto.randomUUID(),
      title,
      description,
      date,
      location,
      startTime,
      endTime,
      color,
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: "12px" },
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h5">{event ? "Edit Event" : "Add New Event"}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box className="mt-2 space-y-4">
          <TextField
            fullWidth
            label="Event Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(false);
            }}
            required
            error={titleError}
            helperText={titleError ? "Title is required" : ""}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: <LocationOn fontSize="small" className="mr-2 text-gray-400" />,
            }}
          />

          <Box className="mt-4">
            <DatePicker label="Date" value={date} onChange={(newDate) => newDate && setDate(newDate)} sx={{ width: "100%" }} />
          </Box>

          <Box className="mt-4 flex gap-4">
            <TimePicker label="Start Time" value={startTime} onChange={(newTime) => newTime && setStartTime(newTime)} sx={{ width: "50%" }} />

            <TimePicker label="End Time" value={endTime} onChange={(newTime) => newTime && setEndTime(newTime)} sx={{ width: "50%" }} />
          </Box>

          <Box className="mt-4">
            <Typography variant="subtitle2" className="mb-2">
              Color Label
            </Typography>
            <div className="flex flex-wrap gap-2">
              {eventColors.map((colorOption) => (
                <div
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`h-8 w-8 cursor-pointer rounded-full transition-all ${color === colorOption ? "ring-2 ring-white ring-offset-2" : ""}`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </Box>

          <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} margin="normal" variant="outlined" />
        </Box>
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} color="inherit" variant="text">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" startIcon={<EventNote />}>
          {event ? "Update Event" : "Create Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;
