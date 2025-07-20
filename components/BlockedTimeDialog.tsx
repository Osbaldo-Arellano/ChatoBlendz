'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import { BlockedTime } from './AppointmentCalendarClient';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (newOrUpdated: BlockedTime) => void;
  block: BlockedTime | null;
};

export default function BlockedTimeDialog({ open, onClose, onSave, block }: Props) {
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (block) {
      const dateObj = new Date(block.date);

      const [startH, startM] = block.start_time.split(':').map(Number);
      const [endH, endM] = block.end_time.split(':').map(Number);

      const start = new Date(dateObj);
      start.setHours(startH, startM, 0, 0);

      const end = new Date(dateObj);
      end.setHours(endH, endM, 0, 0);

      setDate(dateObj);
      setStartTime(start);
      setEndTime(end);
      setReason(block.reason || '');
    } else {
      setDate(null);
      setStartTime(null);
      setEndTime(null);
      setReason('');
    }
  }, [block]);

  const handleSave = () => {
    if (!date || !startTime || !endTime || !block) return;

    const dateStr = date.toISOString().split('T')[0];
    const startStr = startTime.toTimeString().slice(0, 5);
    const endStr = endTime.toTimeString().slice(0, 5);

    onSave({
      ...block,
      date: dateStr,
      start_time: startStr,
      end_time: endStr,
      reason,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{block ? 'Edit Blocked Time' : 'New Blocked Time'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <DatePicker
            label="Date"
            value={date}
            onChange={setDate}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TimePicker
            label="Start Time"
            ampm
            value={startTime}
            onChange={setStartTime}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TimePicker
            label="End Time"
            ampm
            value={endTime}
            onChange={setEndTime}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
