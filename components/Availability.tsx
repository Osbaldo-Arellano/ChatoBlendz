'use client';

import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';
import { Box, Typography, Card, CardContent, Divider, CircularProgress } from '@mui/material';

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
    return <CircularProgress />;
  }

  if (!availability) {
    return (
      <Typography color="text.secondary" textAlign="center">
        Availability unavailable.
      </Typography>
    );
  }

  return (
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
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">
            Availability
          </Typography>
        </Box>

        <Divider sx={{ mb: 2, mt: 1 }} />

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
  );
}
