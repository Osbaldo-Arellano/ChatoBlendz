'use client';

import { Box, Typography, Card, CardContent, Divider } from '@mui/material';

export default function AvailabilityCard() {
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
      <CardContent sx={{ px: 1, py: 3}}>
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
            5:00 PM – 10:00 PM
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Weekends
          </Typography>
          <Typography variant="body1" color="black">
            7:00 AM – 3:00 PM
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
