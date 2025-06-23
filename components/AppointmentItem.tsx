import { Typography, Box } from '@mui/material';
import DeleteButton from './DeleteButton';

type Appointment = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
};

export default function AppointmentItem({
  appt,
  onDelete,
}: {
  appt: Appointment;
  onDelete: (id: string) => void;
}) {
  return (
    <Box>
      <Typography><strong>Name:</strong> {appt.name}</Typography>
      <Typography><strong>Service:</strong> {appt.service}</Typography>
      <Typography><strong>Date:</strong> {appt.date}</Typography>
      <Typography><strong>Time:</strong> {appt.time}</Typography>
      <Box mt={2}>
        <DeleteButton id={appt.id} onDelete={onDelete} />
      </Box>
    </Box>
  );
}
