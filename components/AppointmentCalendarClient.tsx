'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import AppointmentCalendarView from './AppointmentCalendarView';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export type Appointment = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
};

export type BlockedTime = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  status: 'active' | 'cancelled';
};

export default function AppointmentCalendarClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [appointmentsRes, blocksRes] = await Promise.all([
        fetch('/api/admin/appointments'),
        fetch('/api/admin/blocked-times'),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const blockedData = await blocksRes.json();

      setAppointments(appointmentsData);
      setBlockedTimes(blockedData);
    } catch (err) {
      console.error('Error loading data:', err);
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

  async function handleUpdate(updated: Appointment) {
    const res = await fetch('/api/admin/appointments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );
    } else {
      alert('Failed to update appointment');
    }
  }

  async function handleBlockDelete(id: string) {
    if (!confirm('Delete this blocked time?')) return;

    const res = await fetch('/api/admin/blocked-times', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setBlockedTimes((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert('Failed to delete blocked time');
    }
  }

  async function handleBlockUpdate(updated: BlockedTime) {
    console.log(updated);
    const res = await fetch('/api/admin/blocked-times', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const updatedBlock = await res.json();
      setBlockedTimes((prev) =>
        prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
      );
    } else {
      alert('Failed to update blocked time');
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppointmentCalendarView
        appointments={appointments}
        blockedTimes={blockedTimes}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onBlockDelete={handleBlockDelete}
        onBlockUpdate={handleBlockUpdate}
      />
    </LocalizationProvider>
  );
}
