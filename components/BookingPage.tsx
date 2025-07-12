'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BarberProfile from '@/components/BarberProfile';
import ServiceList from '@/components/ServiceList';
import BookingCalendarModal from '@/components/BookingCalendar';
import Footer from '@/components/Footer';
import SectionNav from '@/components/SectionNav';
import HighlightList from '@/components/HighlightList';
import Disclaimers from '@/components/Disclaimer';
import Portfolio from './Portfolio';
import ContactCard from './ContactCard';
import AvailabilityCard from './Availability';

const validTabs = ['Services', 'Details', 'Reviews', 'Portfolio'];

function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 0;
  const normalized = durationStr.toLowerCase().replace(/\s+/g, ' ').trim();
  const hrMatch = normalized.match(/(\d+)\s*hr/);
  const minMatch = normalized.match(/(\d+)\s*min/);
  const hours = hrMatch ? parseInt(hrMatch[1], 10) : 0;
  const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
  return hours * 60 + minutes;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultTab = 'Services';
  const urlTab = searchParams.get('tab');
  const initialTab = validTabs.includes(urlTab || '') ? urlTab! : defaultTab;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedService, setSelectedService] = useState<{
    name: string;
    price: number;
    duration: number;
    parsedDuration: number;
  } | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (urlTab !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', activeTab);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Services':
        return (
          <>
            <ServiceList
              onSelect={(s) => {
                setSelectedService({
                  name: s.name,
                  price: s.price,
                  duration: parseDurationToMinutes(s.duration),
                  parsedDuration: s.parsedDuration
                });
                setCalendarOpen(true);
              }}
            />
            <HighlightList
              onSelect={(s) => {
                setSelectedService({
                  name: s.name,
                  price: s.price,
                  duration: parseDurationToMinutes(s.duration),
                  parsedDuration: s.parsedDuration
                });
                setCalendarOpen(true);
              }}
            />
            <Disclaimers />
          </>
        );
      case 'Portfolio':
        return <Portfolio />;
      case 'Contact':
        return <ContactCard />;
      case 'Availability':
        return <AvailabilityCard />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
      <Box sx={{ flex: 1 }}>
        <BarberProfile />
        <SectionNav active={activeTab} onChange={setActiveTab} />
        {renderTabContent()}
        <BookingCalendarModal
          open={calendarOpen}
          onClose={() => {
            setCalendarOpen(false);
            setSelectedService(null);
          }}
          selectedService={selectedService}
        />
      </Box>
      <Footer />
    </Box>
  );
}
