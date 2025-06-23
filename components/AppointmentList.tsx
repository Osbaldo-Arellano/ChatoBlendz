// components/AppointmentList.tsx
import AppointmentItem from './AppointmentItem';

export default function AppointmentList({ appointments }: { appointments: any[] }) {
  return (
    <ul className="space-y-3">
      {appointments.map((appt) => (
        <AppointmentItem key={appt.id} appt={appt} />
      ))}
    </ul>
  );
}
