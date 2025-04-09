// components/EventCard.tsx
"use client";
import { Paper, Box, Typography, Chip, Button, alpha } from "@mui/material";
import {
    AccessTime,
    LocationOn,
    DeleteOutline,
    EditOutlined,
} from "@mui/icons-material";
import { EventCardProps } from "../types";
import { useTheme } from "@mui/material/styles";

const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            className="event-card"
            sx={{
                p: 0,
                borderRadius: 3,
                overflow: "hidden",
                borderLeft: "4px solid",
                borderLeftColor: event.color || theme.palette.primary.main,
            }}
        >
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {event.title}
                    </Typography>
                    <Chip
                        size="small"
                        label={`${event.startTime.format(
                            "h:mm A"
                        )} - ${event.endTime.format("h:mm A")}`}
                        sx={{
                            borderRadius: 1,
                            bgcolor: alpha(
                                event.color || theme.palette.primary.main,
                                0.1
                            ),
                            color: event.color || theme.palette.primary.main,
                            fontWeight: 500,
                            "& .MuiChip-label": {
                                px: 1,
                            },
                        }}
                        icon={<AccessTime fontSize="small" />}
                    />
                </Box>

                {event.location && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <LocationOn
                            fontSize="small"
                            sx={{ color: "text.secondary", mr: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {event.location}
                        </Typography>
                    </Box>
                )}

                {event.description && (
                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        {event.description}
                    </Typography>
                )}

                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                    <Button
                        variant="text"
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={() => onDelete(event.id)}
                        size="small"
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditOutlined />}
                        onClick={() => onEdit(event)}
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            // color: theme.palette.primary.main,
                            "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                        }}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default EventCard;
