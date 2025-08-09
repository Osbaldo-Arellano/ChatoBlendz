'use client';

import { Box, Typography, Button, Divider, Chip, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import successAnimation from '@/lottiefiles/success.json';

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), {
  ssr: false,
});

type BookingSummary = {
  appointmentId?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  serviceName?: string;
  price?: number;
  addons?: { name: string; price?: number }[] | string[]; // match your shape
  clientName?: string;
  clientPhone?: string;
  smsReminder?: boolean;
  totalPrice?: number;
};

export default function SuccessPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<BookingSummary | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bookingSummary');
      if (raw) {
        const parsed = JSON.parse(raw) as BookingSummary;
        setSummary(parsed);
        sessionStorage.removeItem('bookingSummary'); // one-time read
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const addonsList = (
    Array.isArray(summary?.addons)
      ? (summary!.addons as any[])
          .map((a: any) => (typeof a === 'string' ? a : a?.name))
          .filter(Boolean)
      : []
  ) as string[];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Player
        autoplay
        loop={false}
        keepLastFrame
        src={successAnimation}
        style={{ height: 200, width: 200 }}
      />
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1, color: 'black' }}>
        Appointment Confirmed
      </Typography>
      {/* <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Thank you for booking. We’ve saved your appointment.
      </Typography> */}

      {/* Summary Card */}
      {summary ? (
        <>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Thank you for booking, {summary.clientName}. We’ve saved your appointment.
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: 520,
              bgcolor: '#fafafa',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              mb: 3,
            }}
          >
            {summary.appointmentId && (
              <Typography variant="caption" sx={{ color: 'black' }}>
                Confirmation #: {summary.appointmentId}
              </Typography>
            )}
            <Typography variant="h6" sx={{ mt: 0.5, mb: 1, color: 'black' }}>
              {summary.serviceName ?? 'Service'}
            </Typography>

            <Stack spacing={1.2}>
              <Row label="Date" value={summary.date} />
              <Row label="Time" value={`${summary.startTime}`} />
              {addonsList.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'black' }}>
                    Add-ons
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {addonsList.map((a, i) => (
                      <Chip
                        key={i}
                        label={a}
                        size="small"
                        sx={{ color: 'black', borderColor: 'black' }}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              <Row label="Name" value={summary.clientName ?? '—'} />
              <Row label="Phone" value={summary.clientPhone ?? '—'} />
              <Row label="SMS Reminder" value={summary.smsReminder ? 'Enabled' : 'Disabled'} />
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Row label="Total" value={currency(summary.totalPrice)} strong />
          </Box>
        </>
      ) : (
        <Typography variant="body2" sx={{ mb: 3, color: 'black' }}>
          (No summary found for this session.)
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/')}
        sx={{ fontWeight: 'bold', borderRadius: 2, backgroundColor: 'black' }}
      >
        Return Home
      </Button>
    </Box>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" sx={{ color: 'black' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: strong ? 700 : 500, color: 'black' }}>
        {value}
      </Typography>
    </Box>
  );
}

function currency(v?: number) {
  if (typeof v !== 'number') return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v);
  } catch {
    return `$${v.toFixed(2)}`;
  }
}
