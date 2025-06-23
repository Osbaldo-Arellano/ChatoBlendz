// AppointmentCalendarView.tsx
import { Box, Modal, Typography, useMediaQuery, useTheme, Paper, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useEffect } from 'react';
import AppointmentItem from './AppointmentItem';

type Appointment = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
};

export default function AppointmentCalendarView({ appointments, onDelete }: { appointments: Appointment[],   onDelete: (id: string) => void; }) {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'dayGridWeek'>('dayGridMonth');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setCalendarView(isMobile ? 'dayGridWeek' : 'dayGridMonth');
  }, [isMobile]);

  const events = appointments.map((appt) => ({
    id: appt.id,
    title: `${appt.name} – ${appt.service}`,
    date: appt.date,
    extendedProps: { ...appt },
  }));

  return (
    <Paper elevation={3} sx={{ bgcolor: 'background.default', borderRadius: 4, p: 3, boxShadow: 2 }}>
      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'white',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView={calendarView}
          events={events}
          height="auto"
          eventClick={(info) => setSelectedAppt(info.event.extendedProps as Appointment)}
          key={calendarView}
          headerToolbar={{
            start: 'title',
            center: '',
            end: 'prev,next',
          }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          dayMaxEventRows={3}
        />
      </Box>

      <Modal open={!!selectedAppt} onClose={() => setSelectedAppt(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 420 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, pb: 2, position: 'relative' }}>
            <Typography variant="h6" component="h2" fontWeight="medium" mb={1}>
              Appointment Details
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setSelectedAppt(null)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'grey.500',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 3 }}>
            {selectedAppt && (
              <AppointmentItem
                appt={selectedAppt}
                onDelete={async (id) => {
                  await onDelete(id);
                  setSelectedAppt(null);
                }}
              />
            )}

          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}
