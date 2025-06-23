// app/admin/page.tsx
import { supabase } from '@/lib/supabase';

export default async function Home() {

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch appointments');
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">All Appointments - User Page</h1>

      <ul className="space-y-3">
        {appointments.map((appt) => (
          <li
            key={appt.id}
            className="border border-gray-200 p-4 rounded shadow-sm"
          >
            <div className="font-semibold">{appt.name}</div>
            <div>{appt.service}</div>
            <div>
              {appt.date} @ {appt.time}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
