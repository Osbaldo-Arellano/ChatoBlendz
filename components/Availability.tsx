'use client';

import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);
import loadingAnimation from "@/lottiefiles/Barber's Pole.json"; 

export default function AvailabilityCard() {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
        <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ height: 120, width: 120 }}
        />
      </Box>
    );
  }

  if (!availability) {
    return (
      <Typography color="text.secondary" textAlign="center">
        Availability unavailable.
      </Typography>
    );
  }

  return (

    <>
      <Box display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3  }}>
          <Box>
              <Typography variant="h6" fontWeight="bold" color="text.secondary">Availability</Typography>
              <Typography variant="subtitle2" fontWeight="medium" color="text.secondary"></Typography>
          </Box>
      </Box>

        <Divider sx={{ mb: 2, mt: 1 }} />

          <Card
        sx={{
          mx: 'auto',
          backgroundColor: 'white',
          borderRadius: 0,
          boxShadow: 'none',
          border: 'none',
        }}
      >
        <CardContent sx={{ px: 1, py: 3 }}>


        <Box mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Weekdays
          </Typography>
          <Typography variant="body1" color="black">
            {availability.weekdays?.start} – {availability.weekdays?.end}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Weekends
          </Typography>
          <Typography variant="body1" color="black">
            {availability.weekends?.start} – {availability.weekends?.end}
          </Typography>
        </Box>
      </CardContent>
    </Card>
    </>
    
  );
}
