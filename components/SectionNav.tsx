'use client';

import { Box, Button, useTheme, useMediaQuery } from '@mui/material';

const tabs = ['Services', 'Portfolio', 'Contact', 'Availability'];

export default function SectionNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: isMdUp ? 'flex-start' : 'center',
        py: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isMdUp ? 'flex-start' : 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <Button
              key={tab}
              onClick={() => onChange(tab)}
              disableRipple
              sx={{
                px: 1,
                py: 1,
                minWidth: 'unset',
                color: isActive ? 'black' : '#666',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                borderBottom: isActive ? '2px solid black' : '2px solid transparent',
                borderRadius: 0,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: 'black',
                  borderBottom: isActive ? '2px solid black' : '2px solid #ccc',
                  backgroundColor: 'transparent',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {tab}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
