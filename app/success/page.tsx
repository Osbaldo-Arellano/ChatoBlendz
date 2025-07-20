'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import successAnimation from '@/lottiefiles/success.json';

const Player = dynamic(
    () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
    { ssr: false }
);

export default function SuccessPage() {
    const router = useRouter();

    return (
        <Box
            sx={{
                height: '100vh',
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
                loop
                src={successAnimation}
                style={{ height: 200, width: 200 }}
            />

            <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1, color: 'black' }}>
                Appointment Confirmed!
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                Thank you for booking. We’ve saved your appointment.
            </Typography>

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
