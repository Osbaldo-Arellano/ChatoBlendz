'use client';

import { useState, useEffect } from 'react';
import client  from '@/lib/sanityClient'; 
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  IconButton,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const fallbackServices = [
  {
    name: "Fade",
    description: "A crispy fade will have you ready for any occasion.",
    price: 25,
    duration: "1hr",
  },
  {
    name: "Mid Fade",
    description: "High enough to keep it firme, low enough to keep it classy.",
    price: 25,
    duration: "1hr",
  },
  {
    name: "Taper",
    description: "You’ll walk out looking like you know exactly who you are.",
    price: 25,
    duration: "1hr",
  },
  {
    name: "Fade + Face Cleanup",
    description:
      "Fresh fade, smooth face. This one goes beyond the cut. You’ll leave looking fresh, like you actually slept last night.",
    price: 30,
    duration: "1hr 30m",
  },
  {
    name: "Fade + Beard",
    description:
      "This one’s for when you need the whole package — clean lines up top, full control below. Walk in scruffy, walk out looking like a G.",
    price: 30,
    duration: "1hr 30min",
  },
  {
    name: "Shears",
    description:
      "Precision over clippers. Clean, detailed, and smooth every time.",
    price: 25,
    duration: "1hr",
  },
];

export default function ServiceList({ onSelect }: { onSelect: (service: any) => void }) {
  const [open, setOpen] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await client.fetch(`
          *[_type == "service"] | order(_createdAt asc) {
            _id,
            name,
            description,
            price,
            duration
          }
        `);

        if (!data || data.length === 0) {
          setServices(fallbackServices);
        } else {
          setServices(data);
        }
      } catch (error) {
        console.error("Sanity fetch failed, using fallback services:", error);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);


  return (
    <Box>
      {/* Dropdown Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3  }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Services</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">Tap In!</Typography>
        </Box>
        <IconButton size="small">
          <ExpandMoreIcon
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* Collapsible service list */}
      <Collapse in={open}>
        <Box mt={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            services.map(service => (
              <Card key={service._id} sx={{ borderRadius: 0, borderBottom: '1px dashed #ccc' }}>
                <CardContent sx={{ py: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Left: Service name & description */}
                    <Grid size={{ xs: 7, sm: 5 }}>
                      <Typography fontWeight="bold">{service.name}</Typography>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }}
                        >
                          {service.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', mt: 0.5 }}
                          onClick={() => setSelectedDescription(service.description)}
                        >
                          ...
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Right: Price + duration + Book */}
                    <Grid size={{ xs: 5, sm: 5 }}>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Box>
                          <Typography fontWeight="bold">${service.price.toFixed(2)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.duration}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onSelect(service)}
                          sx={{ textTransform: 'none' }}
                        >
                          Book
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
          <Dialog
            open={!!selectedDescription}
            onClose={() => setSelectedDescription(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Description</DialogTitle>
            <DialogContent>
              <Typography>{selectedDescription}</Typography>
            </DialogContent>
          </Dialog>

        </Box>
      </Collapse>
      
    </Box>
  );
}
