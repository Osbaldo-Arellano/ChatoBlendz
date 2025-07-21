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
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import AdditionalServicesModal from '@/components/AddtionalServices';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import 'react-phone-number-input/style.css';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import client from '@/lib/sanityClient';
import TimeSlotSelector from './TimeSlotSelector';
import { useRouter } from 'next/navigation';
import FullscreenLoading from './FullscreenLoading';
import PhoneNumberField from './PhoneInput';


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  duration?: number;
}

interface AvailabilityWindow {
  start: string;
  end: string;
}

interface Availability {
  weekdays: AvailabilityWindow;
  weekends: AvailabilityWindow;
}

interface BookingModalProps {
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

interface ClientInfo {
  name: string;
  phone: string;
  smsReminder: boolean;
}

const timeSlots = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '11:00 PM',
];

export default function CombinedBookingModal({
  open,
  onClose,
  selectedService,
}: BookingModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<'calendar' | 'clientInfo' | 'confirmation'>('calendar');
  const [days, setDays] = useState<Dayjs[]>([...Array(14)].map((_, i) => dayjs().add(i, 'day')));
  const [selectedDay, setSelectedDay] = useState<Dayjs>(dayjs());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<AdditionalService[]>([]);
  const [addonsModalOpen, setAddonsModalOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    phone: '',
    smsReminder: true,
  });
  const [appointments, setAppointments] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const isSlotsReady = availability && blockedTimes.length > 0;
  const calendarReady = availability && blockedTimes.length > 0;

  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    setShowSlots(false); // hide slots immediately when day changes

    const timeout = setTimeout(() => {
      setShowSlots(true); // show slots after delay
    }, 2400);

    return () => clearTimeout(timeout); // cleanup timer if day changes fast
  }, [selectedDay]);


  const totalPrice =
    (selectedService?.price ?? 0) + selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const dateObj = dayjs(`${selectedDay.format('YYYY-MM-DD')} ${selectedTime}`, 'YYYY-MM-DD h:mm A');
  const end = dateObj.add(selectedService?.parsedDuration ?? 0, 'minute');
  const isWeekend = selectedDay.day() === 0 || selectedDay.day() === 6;
  const currentAvailability = availability
    ? isWeekend
      ? availability.weekends
      : availability.weekdays
    : null;

  useEffect(() => {
    if (selectedDay) fetchSchedule(selectedDay.format('YYYY-MM-DD'));
  }, [selectedDay]);

  interface AvailabilityWindow {
    start: string;
    end: string;
  }

  interface Availability {
    weekdays: AvailabilityWindow;
    weekends: AvailabilityWindow;
  }

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const data = await client.fetch(`
          *[_type == "availability"][0]{
            weekdays,
            weekends
          }
        `);
        setAvailability(data);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
    }

    fetchAvailability();
  }, []);

  async function fetchSchedule(date: string) {
    try {
      const res = await fetch(`/api/getSchedule?date=${encodeURIComponent(date)}`);

      if (!res.ok) throw new Error('Failed to fetch schedule');

      const { appointments, blockedTimes } = await res.json();

      setAppointments(appointments.map((a: { time: string }) => a.time));

      const expandedBlockedTimes: string[] = [];

      blockedTimes.forEach((range: { start_time: string; end_time: string }) => {
        const clean = (str: string) => str.trim().toUpperCase();
        const startIndex = timeSlots.findIndex((slot) => clean(slot) === clean(range.start_time));
        const endIndex = timeSlots.findIndex((slot) => clean(slot) === clean(range.end_time));
        if (startIndex !== -1 && endIndex !== -1) {
          expandedBlockedTimes.push(...timeSlots.slice(startIndex, endIndex + 1));
        }
      });

      setBlockedTimes([
        ...appointments.map((a: { time: string }) => a.time),  // block appointment start times
        ...expandedBlockedTimes,                               // blocked ranges
      ]);

    } catch (e) {
      console.error(e);
    }
  }

  const handleSubmitClientInfo = () => {
    if (!clientInfo.name || !clientInfo.phone) return;
    setStep('confirmation');
  };

  const handleBack = () => {
    if (step === 'clientInfo') setStep('calendar');
    else if (step === 'confirmation') setStep('clientInfo');
  };

  const handleClose = () => {
    setStep('calendar');
    setSelectedTime('');
    setClientInfo({ name: '', phone: '', smsReminder: true });
    onClose();
  };

  async function handleConfirmBooking() {
    setBookingInProgress(true);  // <-- Start showing the FullscreenLoading

    const payload = {
      date: selectedDay.format('YYYY-MM-DD'),
      startTime: selectedTime,
      endTime: end.format('h:mm A'),
      serviceName: selectedService?.name,
      price: selectedService?.price,
      addons: selectedAddons,
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
      smsReminder: clientInfo.smsReminder,
      totalPrice,
    };

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to schedule appointment.');

      setBookingSuccess(true);

      setTimeout(() => {
        router.push('/success');
      }, 3500);

    } catch (err) {
      console.error(err);
      alert('Failed to schedule appointment. Please try again.');
      setBookingInProgress(false);
    }
  }



  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight="bold">Book Your Appointment</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        {step === 'calendar' && (
          <>
            <Typography fontWeight="bold" sx={{ mb: 1 }}>
              Select Date
            </Typography>
            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, mb: 3 }}>
              {days.map((day) => (
                <Button
                  key={day.toString()}
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedTime('');
                  }}
                  sx={{
                    minWidth: 48,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    flexDirection: 'column',
                    color: day.isSame(selectedDay, 'day') ? 'black' : 'white',
                    backgroundColor: day.isSame(selectedDay, 'day') ? '#e0e0e0' : '#1a1a1a',
                    borderRadius: 2,
                    py: 1,
                  }}
                >
                  {day.format('ddd')}
                  <Typography fontSize="0.8rem">{day.format('D')}</Typography>
                </Button>
              ))}
            </Box>

            <Typography fontWeight="bold">Select Time</Typography>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 1,
                mb: 1,
              }}
            ></Box>

            <TimeSlotSelector
              timeSlots={timeSlots}
              availability={availability}
              selectedDay={selectedDay}
              blockedTimes={blockedTimes}
              selectedTime={selectedTime}
              onSelectTime={(time) => setSelectedTime(time)}
              isLoading={!showSlots}
            />
            {/* Preview Section */}
            <Box>
              <Typography fontSize="0.9rem" fontWeight="bold" sx={{ mb: 0.5 }}>
                Date:
              </Typography>
              <Typography variant="body2">
                {selectedDay.format('dddd, MMM D')} at {selectedTime}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography fontSize="0.9rem" fontWeight="bold" sx={{ mb: 0.5 }}>
                Service:
              </Typography>
              <Typography fontSize="0.9rem" fontWeight="bold" sx={{ mb: 0.5 }} gutterBottom>
                {selectedService?.name} - ${selectedService?.price}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, mt: 2 }} />
            <Typography fontSize="0.9rem" fontWeight="bold" sx={{ mb: 0.5 }}>
              Addtional Services:
            </Typography>
            {selectedAddons.length > 0 && (
              <Box>
                {selectedAddons.map((addon) => (
                  <Box
                    key={addon.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      + {addon.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">${addon.price.toFixed(2)}</Typography>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() =>
                          setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id))
                        }
                        sx={{ fontSize: '0.7rem', minWidth: 'unset', px: 0.5 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Typography
              variant="body2"
              sx={{ color: '#1976d2', cursor: 'pointer', mb: 2 }}
              onClick={() => setAddonsModalOpen(true)}
            >
              + Add another service
            </Typography>

            <Typography fontWeight="bold">Total: ${totalPrice.toFixed(2)}</Typography>
          </>
        )}
        {step === 'clientInfo' && (
          <>
            <Typography fontWeight="bold" sx={{ mb: 1 }}>
              Contact Information
            </Typography>

            <TextField
              label="Full Name"
              fullWidth
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <PhoneNumberField
              value={clientInfo.phone}
              onChange={(val) => setClientInfo({ ...clientInfo, phone: val })}
            />


            <FormControlLabel
              control={
                <Checkbox
                  checked={clientInfo.smsReminder}
                  onChange={(e) =>
                    setClientInfo({
                      ...clientInfo,
                      smsReminder: e.target.checked,
                    })
                  }
                />
              }
              label="Send me a text reminder"
            />
          </>
        )}

        {step === 'confirmation' && (
          <>
            <Typography fontWeight="bold" sx={{ mb: 1 }}>
              Confirm Appointment
            </Typography>

            <Typography>
              {dateObj.format('dddd, MMM D')} at {dateObj.format('h:mm A')} (ends{' '}
              {end.format('h:mm A')})
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>
              {selectedService?.name} — ${selectedService?.price}
            </Typography>
            {selectedAddons.map((addon) => (
              <Typography key={addon.id}>
                + {addon.name} — ${addon.price.toFixed(2)}
              </Typography>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography>Client: {clientInfo.name}</Typography>
            <Typography>Phone: {clientInfo.phone}</Typography>
            <Typography>SMS Reminder: {clientInfo.smsReminder ? 'Yes' : 'No'}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight="bold">Total: ${totalPrice.toFixed(2)}</Typography>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {step !== 'calendar' && (
          <Button
            onClick={handleBack}
            sx={{
              backgroundColor: 'lightgrey',
              color: 'black',
              fontWeight: 'bold',
              flex: 1,
              borderRadius: 2,
            }}
          >
            Back
          </Button>
        )}

        {step === 'calendar' && (
          <Button
            disabled={!selectedTime}
            onClick={() => setStep('clientInfo')}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              borderRadius: 2,
            }}
          >
            Continue
          </Button>
        )}

        {step === 'clientInfo' && (
          <Button
            onClick={handleSubmitClientInfo}
            disabled={!clientInfo.name || !clientInfo.phone}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              borderRadius: 2,
            }}
          >
            Confirmation <ChevronRightIcon sx={{ fontSize: '1rem', color: 'white' }} />
          </Button>
        )}
        {step === 'confirmation' && (
          <Button
            onClick={handleConfirmBooking}
            disabled={bookingSuccess}
            sx={{
              backgroundColor: bookingSuccess ? 'green' : 'black',
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              borderRadius: 2,
            }}
          >
            {bookingSuccess ? 'Booked!' : 'Confirm'}
            <CheckCircleIcon sx={{ ml: 1, color: bookingSuccess ? 'white' : 'green' }} />
          </Button>
        )}
      </DialogActions>

      <AdditionalServicesModal
        open={addonsModalOpen}
        onClose={() => setAddonsModalOpen(false)}
        selected={selectedAddons}
        onSelect={setSelectedAddons}
      />

      {bookingInProgress && <FullscreenLoading />}

    </Dialog>
  );
}
