import { Suspense } from 'react';
import BookingPage from '@/components/BookingPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPage />
    </Suspense>
  );
}
