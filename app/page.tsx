'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BarberProfile from '@/components/BarberProfile';
import ServiceList from '@/components/ServiceList';
import BookingCalendar from '@/components/BookingCalendar';
import Footer from '@/components/Footer';
import SectionNav from '@/components/SectionNav';

const validTabs = ['Services', 'Details', 'Reviews', 'Portfolio'];

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultTab = 'Services';
  const urlTab = searchParams.get('tab');
  const initialTab = validTabs.includes(urlTab || '') ? urlTab! : defaultTab;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Sync state with URL param
    if (urlTab !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', activeTab);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Services':
        return !selectedService ? (
          <ServiceList onSelect={setSelectedService} />
        ) : (
          <BookingCalendar selectedService={selectedService} />
        );
      case 'Details':
        return <div style={{ padding: '1rem' }}>Business details go here.</div>;
      case 'Reviews':
        return <div style={{ padding: '1rem' }}>Customer reviews go here.</div>;
      case 'Portfolio':
        return <div style={{ padding: '1rem' }}>Gallery of previous cuts.</div>;
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
      </Box>
      <Footer />
    </Box>
  );
}
