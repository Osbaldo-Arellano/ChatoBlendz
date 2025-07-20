// app/components/AdminPageClient.tsx
'use client';

import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function AdminPageClient() {
  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  );

  useEffect(() => {
    const updateWeekday = () => {
      const weekday = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
      // const year = new Date().toLocaleDateString(undefined, { year: 'numeric'} )
      setTime(weekday);
    };

    updateWeekday();
    const interval = setInterval(updateWeekday, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar position="absolute" color="default" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button href="/" variant="text">
          Client Page
        </Button>
        <Typography>{time}</Typography>
        <Button component="a" href="/api/auth/logout" variant="outlined" color="error">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
