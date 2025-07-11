'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BarberProfile from '@/components/BarberProfile';
import ServiceList from '@/components/ServiceList';
import BookingCalendar from '@/components/BookingCalendar';
import Footer from '@/components/Footer';
import SectionNav from '@/components/SectionNav';
import HighlightList from '@/components/HighlightList';
import Disclaimers from '@/components/Disclaimer';

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
            <>
            <ServiceList onSelect={setSelectedService} />
            <HighlightList onSelect={setSelectedService}/>
            <Disclaimers />
            </>
        ) : (
          <BookingCalendar selectedService={selectedService} />
        );
      case 'Portfolio':
        return <div style={{ padding: '1rem' }}>Portfolio details go here.</div>;
      case 'Contact':
        return <div style={{ padding: '1rem' }}>Contact info here</div>;
      case 'Socials':
        return <div style={{ padding: '1rem' }}>Social media pages</div>;
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
