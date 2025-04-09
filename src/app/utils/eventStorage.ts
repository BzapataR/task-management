// utils/eventStorage.ts
import dayjs from "dayjs";
import { Event } from "../../types";

// Event colors for categories
export const eventColors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f97316", // orange
    "#22c55e", // green
    "#ef4444", // red
];

// Local storage utility functions
export const getEventsFromStorage = (): Event[] => {
    if (typeof window === "undefined") return [];

    try {
        const storedEvents = localStorage.getItem("events");
        if (!storedEvents) return [];

        return JSON.parse(storedEvents).map((event: any) => ({
            ...event,
            date: dayjs(event.date),
            startTime: dayjs(event.startTime),
            endTime: dayjs(event.endTime),
        }));
    } catch (error) {
        console.error("Error loading events:", error);
        return [];
    }
};

export const saveEventsToStorage = (events: Event[]): void => {
    if (typeof window === "undefined") return;

    const eventsToSave = events.map((event) => ({
        ...event,
        date: event.date.toISOString(),
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
    }));

    localStorage.setItem("events", JSON.stringify(eventsToSave));
};

// Helper functions for event management
export const getEventsForDate = (events: Event[], date: dayjs.Dayjs) => {
    return events.filter(
        (event) =>
            event.date.date() === date.date() &&
            event.date.month() === date.month() &&
            event.date.year() === date.year()
    );
};

export const sortEventsByStartTime = (events: Event[]) => {
    return [...events].sort((a, b) => {
        return a.startTime.isBefore(b.startTime) ? -1 : 1;
    });
};

export const getUpcomingEvents = (events: Event[], limit = 3) => {
    return events
        .filter(
            (event) =>
                dayjs().isBefore(event.date) ||
                (dayjs().isSame(event.date, "day") &&
                    dayjs().isBefore(event.endTime))
        )
        .sort((a, b) => {
            if (a.date.isSame(b.date, "day")) {
                return a.startTime.isBefore(b.startTime) ? -1 : 1;
            }
            return a.date.isBefore(b.date) ? -1 : 1;
        })
        .slice(0, limit);
};

// Format date for display
export const formatDateHeader = (date: dayjs.Dayjs) => {
    const today = dayjs();
    const tomorrow = today.add(1, "day");
    const yesterday = today.subtract(1, "day");

    if (date.isSame(today, "day")) {
        return "Today";
    } else if (date.isSame(tomorrow, "day")) {
        return "Tomorrow";
    } else if (date.isSame(yesterday, "day")) {
        return "Yesterday";
    } else {
        return date.format("dddd, MMMM D, YYYY");
    }
};
