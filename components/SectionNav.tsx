'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  // refs to measure buttons
  const navRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // underline position + size
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Measure the active tab and place indicator
  const updateIndicator = () => {
    const container = navRef.current;
    const btn = btnRefs.current[active];
    if (!container || !btn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({
      left: bRect.left - cRect.left,
      width: bRect.width,
    });
  };

  // Measure on mount, active change, and when layout changes
  useLayoutEffect(() => {
    updateIndicator();
    // re-measure after font load / layout settle
    const id = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    // also watch scroll container resizes (e.g., responsive container)
    const ro = new ResizeObserver(onResize);
    if (navRef.current) ro.observe(navRef.current);
    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        bgcolor: 'white',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: isMdUp ? 'flex-start' : 'center',
        py: 1.5,
      }}
    >
      <Box
        ref={navRef}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: isMdUp ? 'flex-start' : 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {/* Animated underline */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            height: 2,
            left: indicator.left,
            width: indicator.width,
            bgcolor: 'black',
            borderRadius: 1,
            transition: 'left 250ms cubic-bezier(.2,.7,.2,1), width 250ms cubic-bezier(.2,.7,.2,1)',
            pointerEvents: 'none',
          }}
        />

        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <Button
              key={tab}
              ref={(el) => {
                btnRefs.current[tab] = el;
              }}
              onClick={() => onChange(tab)}
              disableRipple
              sx={{
                px: 1,
                py: 1,
                minWidth: 'unset',
                color: isActive ? 'black' : '#666',
                fontWeight: isActive ? 700 : 600,
                fontSize: { xs: '0.75rem', sm: '0.75rem', lg: '0.9rem' },
                textTransform: 'uppercase',
                borderRadius: 0,

                transition: 'color 200ms ease, transform 150ms ease',
                '&:hover': {
                  color: 'black',
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
