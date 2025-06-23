import dynamic from 'next/dynamic';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

const AppointmentCalendar = dynamic(() => import('@/components/AppointmentCalendarClient'), {
});

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointment Calendar</h1>
      <AppointmentCalendar />
    </main>
  );
}
