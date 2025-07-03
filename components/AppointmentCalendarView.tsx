'use client';

import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  Stack,
  Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Appointment } from './AppointmentCalendarClient';
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { addDays, format } from 'date-fns';

const DAYS_PER_PAGE = 14;

export default function AppointmentCalendarView({
  appointments,
  onDelete,
  onUpdate,
}: {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onUpdate: (updated: Appointment) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleDays, setVisibleDays] = useState(DAYS_PER_PAGE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const startDate = useMemo(() => new Date(), []);
  const endDate = useMemo(() => addDays(startDate, visibleDays), [startDate, visibleDays]);

  // Scroll and infinite loading
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
    if (nearBottom) {
      setVisibleDays((prev) => prev + DAYS_PER_PAGE);
    }

    setShowScrollTop(el.scrollTop > 300);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Generate visible day list
  const daysToRender = useMemo(() => {
    const days = [];
    for (let i = 0; i < visibleDays; i++) {
      days.push(addDays(startDate, i));
    }
    return days;
  }, [startDate, visibleDays]);

  // Group appointments by date
  const groupedAppointments = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appt of appointments) {
      if (!map.has(appt.date)) map.set(appt.date, []);
      map.get(appt.date)!.push(appt);
    }
    return map;
  }, [appointments]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={3}
        ref={containerRef}
        sx={{
          bgcolor: 'background.paper',
          p: 0,
          boxShadow: 2,
          width: '100%',
          maxHeight: '100vh',
          overflowY: 'auto',
          borderRadius: 0,
        }}
      >
        {daysToRender.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayAppointments = groupedAppointments.get(dateStr) || [];

          return (
            <Box key={dateStr} sx={{ px: 2, py: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {format(day, 'EEEE, MMMM d, yyyy')}
              </Typography>
              <Divider />

              {dayAppointments.length > 0 ? (
                dayAppointments.map((appt) => (
                  <Box
                    key={appt.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold">{appt.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appt.service}
                      </Typography>
                      <Typography variant="body2">
                        {appt.time}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => {
                          const updated = { ...appt, name: prompt('Edit name', appt.name) || appt.name };
                          onUpdate(updated);
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => onDelete(appt.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No appointments for this day.
                </Typography>
              )}
            </Box>
          );
        })}
      </Paper>

      {showScrollTop && (
        <Fab
          color="primary"
          size="small"
          onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
}
