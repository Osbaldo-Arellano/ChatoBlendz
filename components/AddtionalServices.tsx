'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

interface AdditionalService {
  id: string;
  name: string;
  price: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (selected: AdditionalService[]) => void;
  selected: AdditionalService[];
}

const ADD_ONS: AdditionalService[] = [
  { id: 'enhancement', name: 'Hair Enhancement', price: 15 },
  // Add more if needed
];

export default function AdditionalServicesModal({
  open,
  onClose,
  onSelect,
  selected,
}: Props) {
  const [localSelection, setLocalSelection] = useState<AdditionalService[]>(selected);

  const toggleService = (service: AdditionalService) => {
    const exists = localSelection.find((s) => s.id === service.id);
    if (exists) {
      setLocalSelection(localSelection.filter((s) => s.id !== service.id));
    } else {
      setLocalSelection([...localSelection, service]);
    }
  };

  const handleSave = () => {
    onSelect(localSelection);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Add Additional Services</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <List>
          {ADD_ONS.map((service) => {
            const checked = !!localSelection.find((s) => s.id === service.id);
            return (
                <ListItem
                    key={service.id}
                    component="div"
                    onClick={() => toggleService(service)}
                    sx={{ cursor: 'pointer' }}
                    >
                <Checkbox checked={checked} />
                <ListItemText
                  primary={service.name}
                  secondary={`+$${service.price.toFixed(2)}`}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleSave} variant="contained" fullWidth>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
