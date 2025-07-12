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
  '10:00 PM'
];

export default function BookingCalendarModal({
  open,
  onClose,
  selectedService,
}: BookingCalendarModalProps) {
  const [days, setDays] = useState<Dayjs[]>([...Array(14)].map((_, i) => dayjs().add(i, 'day')));
  const [selectedDay, setSelectedDay] = useState<Dayjs>(days[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [addonsModalOpen, setAddonsModalOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<AdditionalService[]>([]);

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
    onClose();
  };

  const totalPrice =
    (selectedService?.price ?? 0) +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 3,
          }}
        >
          <Typography variant="h6">{selectedDay.format('MMMM YYYY')}</Typography>
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
                  sx={{ minWidth: 56, flexDirection: 'column', borderRadius: 2 }}
                >
                  <Typography variant="body2">{day.format('ddd')}</Typography>
                  <Typography fontWeight="bold">{day.format('D')}</Typography>
                </Button>
              </Box>
            ))}
          </Box>

          {/* Time Picker */}
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 1,
              mb: 3,
              pb: 1,
              px: 1,
            }}
          >
            {timeSlots.map((time) => {
              const timeObj = dayjs(`${selectedDay.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD h:mm A');
              const hour = timeObj.hour();
              const minute = timeObj.minute();

              const isWeekend = selectedDay.day() === 0 || selectedDay.day() === 6;

              const startAllowed = isWeekend ? 7 * 60 : 17 * 60; // minutes
              const endAllowed = isWeekend ? 15 * 60 : 22 * 60;

              const currentMinutes = hour * 60 + minute;
              const isDisabled = currentMinutes < startAllowed || currentMinutes >= endAllowed;

              return (
                <Box key={time} sx={{ flex: '0 0 auto' }}>
                  <Button
                    variant={time === selectedTime ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTime(time)}
                    disabled={isDisabled}
                    sx={{ minWidth: 80 }}
                  >
                    {time}
                  </Button>
                </Box>
              );
            })}
          </Box>

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
                        <Typography fontWeight="bold">
                          {selectedDay.format('ddd, D MMMM')}
                        </Typography>
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
            sx={{ borderRadius: 2 }}
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
    </>
  );


}
