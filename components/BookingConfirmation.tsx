'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

interface BookingConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  selectedService: {
    name: string;
    price: number;
    duration: number;
    parsedDuration: number;
  } | null;
  selectedDay: string;
  selectedTime: string;
  selectedAddons: { name: string; price: number }[];
  clientInfo: {
    name: string;
    phone: string;
    smsReminder: boolean;
  };
}


export default function BookingConfirmationModal({
  open,
  onClose,
  selectedService,
  selectedDay,
  selectedTime,
  selectedAddons,
  clientInfo,
}: BookingConfirmationModalProps) {
  const dateObj = dayjs(`${selectedDay} ${selectedTime}`, 'YYYY-MM-DD h:mm A');
  const start = dateObj;
  const end = start.add(selectedService?.parsedDuration ?? 0, 'minute');

  const totalPrice =
    (selectedService?.price ?? 0) +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          pt: 3,
          WebkitJustifyContent:'right'
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="h6" fontWeight="bold" color="text.secondary">
            Appointment Confirmation
          </Typography>
        <Box mb={2} mt={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Date
          </Typography>
          <Typography fontWeight="bold">
            {start.format('dddd, MMM D')} at {start.format('h:mm A')}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Service
          </Typography>
          <Typography>{selectedService?.name}</Typography>
        </Box>

        {selectedAddons.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Add-ons
            </Typography>
            {selectedAddons.map((addon, i) => (
              <Typography key={i}>+ {addon.name} (${addon.price.toFixed(2)})</Typography>
            ))}
          </Box>
        )}

        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Typography variant="body2" color="text.secondary">
            Barber:
          </Typography>
          <Avatar sx={{ width: 24, height: 24 }}>M</Avatar>
          <Typography variant="body2">Mario Bonilla</Typography>
        </Box>

        <Box mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
            Client Info
        </Typography>
        <Typography>{clientInfo.name}</Typography>
        <Typography>{clientInfo.phone}</Typography>
        <Typography color="text.secondary">
            SMS Reminders: {clientInfo.smsReminder ? 'Yes' : 'No'}
        </Typography>
        </Box>


        <Box mt={3}>
          <Typography variant="subtitle2">Total: ${totalPrice.toFixed(2)}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ borderRadius: 2 }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
