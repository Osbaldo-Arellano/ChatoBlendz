'use client';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { format, isBefore } from 'date-fns';

interface Availability {
  weekdays: { start: string; end: string };
  weekends: { start: string; end: string };
}

function parseTimeTo24Hour(timeStr: string): [number, number] {
  const date = new Date(`2000-01-01 ${timeStr}`);
  return [date.getHours(), date.getMinutes()];
}

export default function BlockTimeButton({
  onSuccess,
  availability,
}: {
  onSuccess: () => void;
  availability: Availability;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!date || !startTime || !endTime) {
      setError('Please fill out all required fields.');
      return;
    }

    if (isBefore(endTime, startTime)) {
      setError('End time must be after start time.');
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    const formattedStartTime = format(startTime, 'HH:mm');
    const formattedEndTime = format(endTime, 'HH:mm');

    const res = await fetch('/api/admin/blocked-times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        reason,
      }),
    });

    if (res.ok) {
      setOpen(false);
      onSuccess();
      resetForm();
    } else {
      setError('Failed to create block.');
    }
  };

const blockWholeDay = () => {
  if (!date || !availability) return;

  const isWeekend = [0, 6].includes(date.getDay());
  const timeWindow = isWeekend ? availability.weekends : availability.weekdays;

  if (!timeWindow?.start || !timeWindow?.end) {
    setError('Availability configuration missing.');
    return;
  }

  const [startH, startM] = parseTimeTo24Hour(timeWindow.start);
  const [endH, endM] = parseTimeTo24Hour(timeWindow.end);

  const start = new Date(date);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(date);
  end.setHours(endH, endM, 0, 0);

  setStartTime(start);
  setEndTime(end);
};


  const resetForm = () => {
    setStartTime(null);
    setEndTime(null);
    setReason('');
    setError(null);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Block Time
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Block Time</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {error && <Alert severity="error">{error}</Alert>}
            <DatePicker label="Date" value={date} onChange={setDate} />
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              minutesStep={30}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              minutesStep={30}
            />
            <TextField
              label="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            />

            <Button variant="outlined" onClick={blockWholeDay}>
              Block Whole Day
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
