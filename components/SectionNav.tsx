'use client';

import { Box, Button } from '@mui/material';

const tabs = ['Services', 'Portfolio', 'Contact', 'Availability'];

export default function SectionNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid #ccc',
        backgroundColor: 'white',
        px: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onChange(tab)}
          sx={{
            textTransform: 'none',
            fontWeight: active === tab ? 'bold' : 'normal',
            fontSize: '0.875rem', // Match default button size
            borderBottom: active === tab ? '2px solid black' : 'none',
            color: 'black',
            borderRadius: 0,
            mx: 1,
            py: 1.5,
            '&:hover': {
              backgroundColor: 'transparent', // keep clean look
              borderBottom: '2px solid black',
            },
          }}
        >
          {tab}
        </Button>
      ))}
    </Box>
  );
}
