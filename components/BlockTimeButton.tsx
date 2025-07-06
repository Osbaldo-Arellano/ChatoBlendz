'use client';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Alert
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { format, addDays, isBefore } from 'date-fns';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BlockTimeButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (day: number) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getPreviewDates = () => {
    if (!startDate) return [];
    const previews = repeatDays.map((dayOffset) => {
      const targetDate = addDays(startDate, dayOffset);
      return format(targetDate, 'yyyy-MM-dd');
    });
    return previews;
  };

  const handleSubmit = async () => {
    if (!startDate || !startTime || !endTime) {
      setError('Please fill out all required fields.');
      return;
    }

    if (isBefore(endTime, startTime)) {
      setError('End time must be after start time.');
      return;
    }

    if (repeatDays.length === 0) {
      setError('Please select at least one recurrence day.');
      return;
    }

    const formattedStartTime = format(startTime, 'HH:mm');
    const formattedEndTime = format(endTime, 'HH:mm');

    const res = await fetch('/api/admin/blocked-times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repeatDays,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        reason,
        startDate: format(startDate, 'yyyy-MM-dd')
        })
    });

    if (res.ok) {
      setOpen(false);
      onSuccess();
      resetForm();
    } else {
      setError('Failed to create block.');
    }
  };

  const resetForm = () => {
    setStartTime(null);
    setEndTime(null);
    setReason('');
    setRepeatDays([]);
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
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
            <TimePicker label="Start Time" value={startTime} onChange={setStartTime} />
            <TimePicker label="End Time" value={endTime} onChange={setEndTime} />
            <TextField
              label="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            />

            <FormGroup row>
              {weekdayLabels.map((label, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={repeatDays.includes(i)}
                      onChange={() => toggleDay(i)}
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>

            {repeatDays.length > 0 && (
              <Box>
                <strong>Preview Dates:</strong>
                <ul>
                  {getPreviewDates().map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Box>
            )}
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
