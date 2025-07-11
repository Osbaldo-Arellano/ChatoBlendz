'use client';
import { useState } from 'react';
import BarberProfile from '@/components/BarberProfile';
import ServiceList from '@/components/ServiceList';
import BookingCalendar from '@/components/BookingCalendar';
import Footer from '@/components/Footer';
import { Box } from '@mui/material';
import Image from 'next/image';


export default function BookingPage() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      {/* Main content that grows to fill space */}
      <Box sx={{ flex: 1 }}>
        <BarberProfile />
        {!selectedService ? (
          <ServiceList onSelect={setSelectedService} />
        ) : (
          <BookingCalendar selectedService={selectedService} />
        )}
      </Box>

      {/* Sticky Footer */}
      <Footer />
    </Box>
  );
}
