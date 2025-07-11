'use client';
import { Box, Button } from '@mui/material';

const tabs = ['Services', 'Gallery', 'Contact', 'Socials'];

export default function SectionNav({ active, onChange }: {
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
            borderBottom: active === tab ? '2px solid black' : 'none',
            color: 'black',
            borderRadius: 0,
            mx: 1,
          }}
        >
          {tab}
        </Button>
      ))}
    </Box>
  );
}
