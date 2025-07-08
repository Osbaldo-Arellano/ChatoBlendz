'use client';
import { useState } from 'react';
import BarberProfile from '@/components/BarberProfile';
import ServiceList from '@/components/ServiceList';
import BookingCalendar from '@/components/BookingCalendar';
import { Box } from '@mui/material';

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <Box sx={{backgroundColor:'white'}}>
      <BarberProfile />
      {!selectedService ? (
        <ServiceList onSelect={setSelectedService} />
      ) : (
        <BookingCalendar selectedService={selectedService} />
      )}
    </Box>
  );
}
