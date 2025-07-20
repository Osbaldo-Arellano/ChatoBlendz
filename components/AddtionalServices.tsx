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
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';
import dynamic from 'next/dynamic';
const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), {
  ssr: false,
});
import loadingAnimation from "@/lottiefiles/Barber's Pole.json";

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

export default function AdditionalServicesModal({ open, onClose, onSelect, selected }: Props) {
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3, backgroundColor: 'white', color: 'black' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.1rem',
        }}
      >
        Add Additional Services
        <IconButton onClick={onClose} sx={{ color: 'black' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: '#ccc' }} />

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
              <Player autoplay loop src={loadingAnimation} style={{ height: 120, width: 120 }} />
            </Box>
          </Box>
        ) : (
          <List>
            {addOns.map((service) => {
              const checked = !!localSelection.find((s) => s.id === service.id);
              return (
                <ListItem
                  key={service.id}
                  onClick={() => toggleService(service)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: checked ? '#f0f0f0' : 'transparent',
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': { bgcolor: '#f9f9f9' },
                  }}
                  secondaryAction={
                    <Typography fontWeight="bold" fontSize="0.9rem">
                      +${service.price.toFixed(2)}
                    </Typography>
                  }
                >
                  <Checkbox checked={checked} sx={{ color: 'black' }} />
                  <ListItemText
                    primary={
                      <Typography fontWeight={checked ? 'bold' : 'medium'} color="black">
                        {service.name}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: '#ccc' }} />

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
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Save Selections
        </Button>
      </DialogActions>
    </Dialog>
  );
}
