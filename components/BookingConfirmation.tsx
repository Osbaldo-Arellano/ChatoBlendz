'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  Box,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

interface BookingConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void; 
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
  onBack,
  selectedService,
  selectedDay,
  selectedTime,
  selectedAddons,
  clientInfo,
}: BookingConfirmationModalProps) {
  const dateObj = dayjs(`${selectedDay} ${selectedTime}`, 'YYYY-MM-DD h:mm A');
  const end = dateObj.add(selectedService?.parsedDuration ?? 0, 'minute');

  const totalPrice =
    (selectedService?.price ?? 0) +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2, position: 'relative' }}>
        <Typography variant="h6" fontWeight="bold">
          Appointment Confirmation
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Date & Time */}
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            When
          </Typography>
          <Typography fontWeight="medium">
            {dateObj.format('dddd, MMM D')} at {dateObj.format('h:mm A')} (
            ends at {end.format('h:mm A')})
          </Typography>
        </Box>

        <Divider />

        {/* Service & Add-ons */}
        <Box my={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Service(s)
          </Typography>
          <List dense disablePadding>
            <ListItem disableGutters sx={{ py: 0.5 }}>
              <ListItemText
                primary={selectedService?.name}
                primaryTypographyProps={{ fontWeight: 'medium' }}
                secondary={`$${selectedService?.price.toFixed(2)}`}
              />
            </ListItem>
            {selectedAddons.map((a, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                <ListItemText
                  primary={`+ ${a.name}`}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondary={`$${a.price.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* Barber & Client Info */}
        <Box my={2} display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Barber
            </Typography>
            <Typography fontWeight="medium">Mario Bonilla</Typography>
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Your Info:
          </Typography>
          <Typography>{clientInfo.name}</Typography>
          <Typography>{clientInfo.phone}</Typography>
          <Typography color="text.secondary" variant="body2">
            SMS Reminders: {clientInfo.smsReminder ? 'Yes' : 'No'}
          </Typography>
        </Box>

        <Divider />

        {/* Total */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, flexDirection: 'column', gap: 1 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ borderRadius: 2 }}
          onClick={onBack} // GOES BACK
        >
          Back
        </Button>

        <Button
          variant="contained"
          fullWidth
          disabled={!selectedTime}
          sx={{ borderRadius: 2, background: "black" }}
          onClick={() => {
            onClose();
          }}
        >
          Confirm Appointment
        </Button>
      </DialogActions>


    </Dialog>
  );
}
