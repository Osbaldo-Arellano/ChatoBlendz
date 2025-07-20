'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { Appointment } from './AppointmentCalendarClient';
import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  appointment: Appointment;
  onClose: () => void;
  onSave: (updated: Appointment) => void;
}

export default function AppointmentEditDialog({ open, appointment, onClose, onSave }: Props) {
  const [form, setForm] = useState<Appointment>(appointment);

  useEffect(() => {
    setForm(appointment);
  }, [appointment]);

  const handleChange = (field: keyof Appointment, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'total_price' ? parseFloat(value) : value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Appointment</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Client Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
          />
          <TextField
            label="Service"
            value={form.service}
            onChange={(e) => handleChange('service', e.target.value)}
            fullWidth
          />
          <TextField
            label="Date (YYYY-MM-DD)"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            fullWidth
          />
          <TextField
            label="Start Time"
            value={form.start_time}
            onChange={(e) => handleChange('start_time', e.target.value)}
            fullWidth
          />
          <TextField
            label="Total Price"
            type="number"
            value={form.total_price || ''}
            onChange={(e) => handleChange('total_price', e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
