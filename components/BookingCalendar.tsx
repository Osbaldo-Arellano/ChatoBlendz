'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import AdditionalServicesModal from '@/components/AddtionalServices';
import BookingConfirmation from './BookingConfirmation';
import ClientInfo from './ClientInfo';
import { supabase } from '@/lib/supabase';

interface BookingCalendarModalProps {
  open: boolean;
  onClose: () => void;
  selectedService: {
    name: string;
    price: number;
    duration: number;
    parsedDuration: number;
  } | null;
}

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  duration?: number;
}

const timeSlots = [
  '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM',
  '10:00 PM', '11:00 PM'
];

interface AvailabilityWindow {
  start: string; // e.g. "5:00 PM"
  end: string;   // e.g. "11:00 PM"
}

interface Availability {
  weekdays: AvailabilityWindow;
  weekends: AvailabilityWindow;
}

interface BookingCalendarModalProps {
  open: boolean;
  onClose: () => void;
  selectedService: {
    name: string;
    price: number;
    duration: number;
    parsedDuration: number;
  } | null;
  availability: Availability; 
}

export default function BookingCalendarModal({
  open,
  onClose,
  selectedService,
  availability
}: BookingCalendarModalProps) {
  const [days, setDays] = useState<Dayjs[]>([...Array(14)].map((_, i) => dayjs().add(i, 'day')));
  const [selectedDay, setSelectedDay] = useState<Dayjs>(days[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [addonsModalOpen, setAddonsModalOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<AdditionalService[]>([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmedService, setConfirmedService] = useState<typeof selectedService>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [finalConfirmationOpen, setFinalConfirmationOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState<{
    name: string;
    phone: string;
    smsReminder: boolean;
  } | null>(null);
  const [appointments, setAppointments] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 50;

    if (nearEnd) {
      const lastDay = days[days.length - 1];
      const moreDays = [...Array(7)].map((_, i) => lastDay.add(i + 1, 'day'));
      setDays((prev) => [...prev, ...moreDays]);
    }
  };

  useEffect(() => {
    if (!selectedDay && days.length) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  const handleContinue = () => {
    setConfirmedService(selectedService); // Save it before closing
    onClose(); // this triggers parent clear
    setClientModalOpen(true);
  };

  const totalPrice =
    (selectedService?.price ?? 0) +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);


const getAllowedTimeSlots = () => {
  if (!availability) {
    return {
      weekdays: [],
      weekends: []
    };
  }

  const getSlotsForWindow = (window: { start: string; end: string }, label: string) => {
    const clean = (str: string) => str.trim().toUpperCase();

    const cleanedStart = clean(window.start);
    const cleanedEnd = clean(window.end);

    const startIndex = timeSlots.findIndex(slot => clean(slot) === cleanedStart);
    const endIndex = timeSlots.findIndex(slot => clean(slot) === cleanedEnd);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    const sliced = timeSlots.slice(startIndex, endIndex + 1);

    return sliced;
  };

  return {
    weekdays: getSlotsForWindow(availability.weekdays, 'Weekdays'),
    weekends: getSlotsForWindow(availability.weekends, 'Weekends')
    };
  };

async function fetchSchedule(date: string) {
  setLoadingSlots(true);

  try {
    const res = await fetch(`/api/getSchedule?date=${encodeURIComponent(date)}`);

    if (!res.ok) {
      console.error('Failed to fetch schedule');
      setAppointments([]);
      setBlockedTimes([]);
      return;
    }

    const { appointments, blockedTimes } = await res.json();

    setAppointments(appointments.map((a: { time: string }) => a.time));
    
    // Flatten blocked time ranges into individual slots
    const expandedBlockedTimes: string[] = [];

    blockedTimes.forEach((range: { start_time: string; end_time: string }) => {
      const clean = (str: string) => str.trim().toUpperCase();
      const startIndex = timeSlots.findIndex(slot => clean(slot) === clean(range.start_time));
      const endIndex = timeSlots.findIndex(slot => clean(slot) === clean(range.end_time));

      if (startIndex !== -1 && endIndex !== -1) {
        expandedBlockedTimes.push(...timeSlots.slice(startIndex, endIndex + 1));
      }
    });

    setBlockedTimes(expandedBlockedTimes);

  } catch (error) {
    console.error('Error fetching schedule:', error);
    setAppointments([]);
    setBlockedTimes([]);
  } finally {
    setLoadingSlots(false);
  }
}


useEffect(() => {
  if (selectedDay) {
    fetchSchedule(selectedDay.format('YYYY-MM-DD'));
  }
}, [selectedDay]);

const isUnavailable = (time: string) =>
  appointments.includes(time) || blockedTimes.includes(time);



  return (
    <>
      <Dialog fullWidth open={open} onClose={onClose}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 3,
          }}
        >
          <Typography>{selectedDay.format('MMMM YYYY')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3 }}>
          {/* Date Picker */}
          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 1,
              mb: 3,
              pb: 1,
            }}
          >
            {days.map((day) => (
              <Box key={day.toString()} sx={{ flex: '0 0 auto' }}>
                <Button
                  variant={day.isSame(selectedDay, 'day') ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedTime('');
                  }}
                  sx={{
                    minWidth: 56,
                    flexDirection: 'column',
                    borderRadius: 2,
                    background: day.isSame(selectedDay, 'day') ? 'lightgrey' : '#1a1a1a',
                    color: day.isSame(selectedDay, 'day') ? 'black' : 'white',
                  }}
                >
                  <Typography variant="body2">{day.format('ddd')}</Typography>
                  <Typography fontWeight="bold">{day.format('D')}</Typography>
                </Button>
              </Box>
            ))}
          </Box>

          {/* Time Picker */}
          {!availability ? (
            <Typography variant="body1">Loading available times...</Typography>
          ) : (
            (() => {
              const allowedTimeSlots = getAllowedTimeSlots();
              const isWeekend = selectedDay.day() === 0 || selectedDay.day() === 6;
              const slotsToShow = isWeekend ? allowedTimeSlots.weekends : allowedTimeSlots.weekdays;
              const isUnavailable = (time: string) => appointments.includes(time) || blockedTimes.includes(time);

              return (
                <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, mb: 3, pb: 1, px: 1 }}>
                  {slotsToShow.length > 0 ? (
                    slotsToShow.map((time) => (
                      <Box key={time} sx={{ flex: '0 0 auto' }}>
                        <Button
                          variant='contained'
                          disabled={isUnavailable(time)}
                          sx={{
                            minWidth: 80,
                            background: isUnavailable(time)
                              ? '#cccccc'
                              : time === selectedTime
                              ? 'lightgrey'
                              : '#1a1a1a',
                            color: isUnavailable(time) ? 'gray' : time === selectedTime ? 'black' : 'white',
                            opacity: isUnavailable(time) ? 0.5 : 1,
                          }}
                          onClick={() => !isUnavailable(time) && setSelectedTime(time)}
                        >
                          {time}
                        </Button>

                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No available times.</Typography>
                  )}
                </Box>
              );
            })()
          )}

          {/* Service Summary */}
          {selectedService && (
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#f9f9f9',
                mb: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight="bold">{selectedService.name}</Typography>
                <Typography fontWeight="bold">${selectedService.price.toFixed(2)}</Typography>
              </Box>
                {selectedTime && selectedService && (() => {
                  const datetimeStr = `${selectedDay.format('YYYY-MM-DD')} ${selectedTime}`;
                  const start = dayjs(datetimeStr, 'YYYY-MM-DD h:mm A', true); // strict parsing

                  if (!start.isValid()) {
                    return (
                      <Typography color="error">
                        Invalid time selected
                      </Typography>
                    );
                  }

                  const duration = Number(selectedService.parsedDuration || selectedService.duration || 0);
                  const end = start.add(duration, 'minute');

                  return (
                  <Box>
                    <Typography color="text.secondary">
                      {start.format('h:mm A')} – {end.format('h:mm A')}
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedDay.format('ddd, D MMMM')}
                    </Typography>
                  </Box>   
                  );
                })()}
              <Box mt={2} display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">Barber:</Typography>
                <Avatar sx={{ width: 24, height: 24 }}>M</Avatar>
                <Typography variant="body2">Mario Bonilla</Typography>
              </Box>

              {/* Display selected add-ons */}
              {selectedAddons.length > 0 && (
              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                {selectedAddons.map((addon) => (
                  <Box
                    key={addon.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ backgroundColor: '#f1f1f1', px: 2, py: 1, borderRadius: 1 }}
                  >
                    <Typography variant="body2">
                      + {addon.name} (${addon.price.toFixed(2)})
                    </Typography>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() =>
                        setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id))
                      }
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
            </Box>
          )}

          {/* Add another service */}
          <Typography
            variant="body2"
            sx={{ color: '#1976d2', cursor: 'pointer', mb: 3 }}
            onClick={() => setAddonsModalOpen(true)}
          >
            + Add another service
          </Typography>

          {/* Total Summary */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>Total:</Typography>
            <Typography fontWeight="bold">
              ${totalPrice.toFixed(2)}{' '}
            <Typography component="span" color="text.secondary">
              {selectedService?.parsedDuration} 
            </Typography>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleContinue}
            disabled={!selectedTime}
            sx={{ borderRadius: 2, background:"black"  }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add-ons Modal */}
      <AdditionalServicesModal
        open={addonsModalOpen}
        onClose={() => setAddonsModalOpen(false)}
        selected={selectedAddons}
        onSelect={(addons) => setSelectedAddons(addons)}
      />

      <ClientInfo
        open={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        selectedService={confirmedService}
        onSubmit={(info) => {
          setClientInfo(info);
          setClientModalOpen(false); 
          setFinalConfirmationOpen(true); 
        }}
      />

      {clientInfo && (
        <BookingConfirmation
          open={finalConfirmationOpen}
          onClose={() => setFinalConfirmationOpen(false)}
          selectedService={confirmedService}
          selectedDay={selectedDay.format('YYYY-MM-DD')}
          selectedTime={selectedTime}
          selectedAddons={selectedAddons}
          clientInfo={clientInfo}
        />
      )}
    </>
  );


}
