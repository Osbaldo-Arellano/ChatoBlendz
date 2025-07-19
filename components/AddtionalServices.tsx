'use client'

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
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';

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

export default function AdditionalServicesModal({
  open,
  onClose,
  onSelect,
  selected,
}: Props) {
  const [localSelection, setLocalSelection] = useState<AdditionalService[]>(selected);
  const [addOns, setAddOns] = useState<AdditionalService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdditions() {
      try {
        const data = await client.fetch(`
          *[_type == "additions"]{
            _id,
            name,
            price
          }
        `);

        const formatted = data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
        }));

        setAddOns(formatted);
      } catch (error) {
        console.error('Failed to fetch additions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdditions();
  }, []);

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
        Add Additional Services
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>


      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {addOns.map((service) => {
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
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
