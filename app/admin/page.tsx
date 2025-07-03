// app/admin/page.tsx
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { Box, Paper } from '@mui/material';
import AdminPageClient from '@/components/AdminPageClient'

const AppointmentCalendar = dynamic(() => import('@/components/AppointmentCalendarClient'), {
});

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login?returnTo=/admin');
  }

  return (
    <Box sx={{ px: 0, py: 3, background: 'white' }}>
      <Paper
        sx={{
          bgcolor: 'background.paper',
          p: 0,
          boxShadow: 2,
          width: '100%',
          maxHeight: '100vh',
          overflowY: 'auto',
          borderRadius: 0,
        }}
      >
        <AdminPageClient />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Image
          src="/images/client.png"
          alt="Client Logo"
          width={125}
          height={125}
        />
      </Box>
      </Paper>
      
      <AppointmentCalendar />
    </Box>
  );
}
