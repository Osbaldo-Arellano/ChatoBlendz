'use client';

import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function AdminPageClient() {
  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar position="absolute" color="default" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button href="/" variant="text">View Client Page</Button>
        <Typography>{time}</Typography>
<Button component="a" href="/api/auth/logout" variant="outlined" color="error">
  Logout
</Button>
      </Toolbar>
    </AppBar>
  );
}
