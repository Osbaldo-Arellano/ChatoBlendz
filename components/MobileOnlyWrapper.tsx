'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

export default function MobileOnlyWrapper({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    if (!isMobile) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    px: 2,
                    color: 'black',
                    bgcolor: 'white',
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    This site is designed for mobile use only.
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                    Please scan the QR code below to visit on your phone.
                    <br />
                    Or visit chato-blendz.vercel.app on your phone.
                </Typography>
                <Image
                    src="/images/qr-code.png"
                    alt="QR code to booking site"
                    width={200}
                    height={200}
                />
            </Box>
        );
    }

    return <>{children}</>;
}
