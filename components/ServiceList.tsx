'use client';

import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import loadingAnimation from "@/lottiefiles/Barber's Pole.json";

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((m) => m.Player), {
  ssr: false,
});

const fallbackServices = [
  { name: 'Fade!', description: 'A crispy fade...', price: 25, duration: '1hr' },
  { name: 'Mid Fade', description: 'High enough...', price: 25, duration: '1hr' },
  { name: 'Taper', description: 'You’ll walk out...', price: 25, duration: '1hr' },
  { name: 'Fade + Face Cleanup', description: 'Fresh fade...', price: 30, duration: '1hr 30m' },
  { name: 'Fade + Beard', description: 'Whole package...', price: 30, duration: '1hr 30min' },
  { name: 'Shears', description: 'Precision over...', price: 25, duration: '1hr' },
];

export default function ServiceList({ onSelect }: { onSelect: (service: any) => void }) {
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
        setServices(data?.length ? data : fallbackServices);
      } catch (err) {
        console.error('Sanity fetch failed, using fallback services:', err);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <Box mt={3}>
      <Box mb={2} ml={1}>
        <Typography variant="h6" fontWeight="bold" color="text.secondary">
          Services
        </Typography>
        <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
          Tap In!
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <Player autoplay loop src={loadingAnimation} style={{ height: 120, width: 120 }} />
        </Box>
      ) : (
        services.map((service) => (
          <Box key={service._id || service.name} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
              <Grid container>
                {/* Left: Service name & description */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  {' '}
                  <Typography fontWeight="bold" color="text.primary">
                    {service.name}
                  </Typography>
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
                      Read more
                    </Typography>
                  </Box>
                </Grid>

                {/* Right: Price + duration + Book */}
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      ml: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'wrap',
                      textAlign: { xs: 'left', sm: 'right' },
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold" color="text.primary">
                        ${Number(service.price).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.primary">
                        {service.duration}
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => onSelect(service)}
                      sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#222' },
                        '&:disabled': { backgroundColor: '#555', color: 'white' },
                      }}
                    >
                      Book
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Box>
        ))
      )}

      {/* Dialog for description */}
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
  );
}
