import { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import dayjs from 'dayjs';

const days = [...Array(7)].map((_, i) => dayjs().add(i, 'day'));

const timeSlots = ['10:00 AM', '10:30 AM', '3:00 PM', '3:15 PM'];

export default function BookingCalendar({ selectedService }: { selectedService: any }) {
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <Box mt={3}>
      <Typography variant="h6">Select Date</Typography>
      <Grid container spacing={1} mt={1}>
        {days.map(day => (
          <Grid  key={day.toString()}>
            <Button
              variant={day.isSame(selectedDay, 'day') ? 'contained' : 'outlined'}
              onClick={() => setSelectedDay(day)}
            >
              {day.format('ddd D')}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography mt={2}>Select Time</Typography>
      <Grid container spacing={1} mt={1}>
        {timeSlots.map(time => (
          <Grid  key={time}>
            <Button
              variant={time === selectedTime ? 'contained' : 'outlined'}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box mt={3}>
        <Typography variant="body1">Service: {selectedService?.name}</Typography>
        <Typography variant="body1">Total: ${selectedService?.price}</Typography>
        <Typography variant="body1">Time: {selectedTime}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} disabled={!selectedTime}>Continue</Button>
      </Box>
    </Box>
  );
}
