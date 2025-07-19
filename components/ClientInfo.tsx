'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

interface Service {
  name: string;
  price: number;
  duration: number;
  parsedDuration: number;
}

interface ClientInfo {
  name: string;
  phone: string;
  smsReminder: boolean;
}

interface ClientInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (clientInfo: ClientInfo) => void;
  selectedService: Service | null;
}

export default function ClientInfoModal({
  open,
  onClose,
  onSubmit,
  selectedService,
}: ClientInfoModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsReminder, setSmsReminder] = useState(true);

  const handleSubmit = () => {
    if (!name || !phone) return;
    onSubmit({ name, phone, smsReminder }); // Send data to parent
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'right',
          px: 3,
          pt: 3,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1 }}>
        <Box sx={{ mb: 1 }}>
          {selectedService && (
            <Box mb={3}>
              <Typography fontWeight="bold">{selectedService.name}</Typography>
              <Typography color="text.secondary">
                ${selectedService.price.toFixed(2)} · {selectedService.duration} min
              </Typography>
            </Box>
          )}

          <Typography variant="h6" fontWeight="bold" color="text.secondary">
            Contact Information
          </Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
            Enter your contact information
          </Typography>
        </Box>

        <Box mb={3}>
          <TextField
            label="Full Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box mb={3}>
          <TextField
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="(555) 123-4567"
          />
        </Box>

        <FormControlLabel
          sx={{ mb: 3 }}
          control={
            <Checkbox
              checked={smsReminder}
              onChange={(e) => setSmsReminder(e.target.checked)}
            />
          }
          label="Send me a text reminder"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ borderRadius: 2, background:"black" }}
        >
          Continue to Confirmation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
