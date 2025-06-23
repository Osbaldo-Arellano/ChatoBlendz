'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import AppointmentCalendarView from './AppointmentCalendarView';

export type Appointment = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
};

export default function AppointmentCalendarClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/admin/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;

    const res = await fetch('/api/admin/appointments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert('Failed to delete');
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppointmentCalendarView
      appointments={appointments}
      onDelete={handleDelete}
    />
  );
}
