// types/index.ts
import { Dayjs } from 'dayjs';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Dayjs;
  location: string;
  startTime: Dayjs;
  endTime: Dayjs;
  color?: string;
}

export interface NavItem {
  text: string;
  icon: React.ReactNode;
  route: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  event?: Event;
  selectedDate: Dayjs;
}

export interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}