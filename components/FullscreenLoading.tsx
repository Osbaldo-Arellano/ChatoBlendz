'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), {
  ssr: false,
});
import loadingAnimation from "@/lottiefiles/Barber's Pole.json";

export default function FullscreenLoading() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: 200, width: 200 }}
      />
    </Box>
  );
}
