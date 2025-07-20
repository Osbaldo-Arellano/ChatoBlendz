'use client';

import { Box, Button, Typography } from '@mui/material';

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
        backgroundColor: 'transparent',
        py: 1,
        position: 'sticky',
        top: 0,
        zIndex: 20,
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
              position: 'relative',
              textTransform: 'uppercase',
              py: 1,
              minWidth: 'unset',
              color: isActive ? '#000' : '#AAA',
              '&:hover': {},
              '&::after': isActive
                ? {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: 0,
                    width: '40px',
                    height: '10px',
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='40' height='10' viewBox='0 0 40 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,5 C10,10 30,0 40,5' stroke='black' fill='transparent' stroke-width='2'/%3E%3C/svg%3E\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }
                : {},
            }}
          >
            <Typography
              fontWeight={isActive ? 600 : 400}
              letterSpacing="0.05em"
              sx={{ fontSize: '0.8rem' }}
            >
              {tab}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
}
