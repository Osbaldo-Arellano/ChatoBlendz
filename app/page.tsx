import { Suspense } from 'react';
import BookingPage from '@/components/BookingPage';
import MobileOnlyWrapper from '@/components/MobileOnlyWrapper';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPage />
    </Suspense>
  );
}
