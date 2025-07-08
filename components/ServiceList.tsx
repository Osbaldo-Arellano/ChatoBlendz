'use client';
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const services = [
  { id: 1, name: "Standard Haircut", description: "World-class cut", price: 100, duration: "1h" },
  { id: 2, name: "Haircut + Beard", description: "Cut and beard", price: 125, duration: "1h 30m" }
];

export default function ServiceList({ onSelect }: { onSelect: (service: any) => void }) {
  const [open, setOpen] = useState(true);

  return (
    <Box>
      {/* Dropdown Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', mb: 1 }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="text.secondary">Services</Typography>
          <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">Tap In!</Typography>
        </Box>
        <IconButton size="small">
          <ExpandMoreIcon
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* Collapsible service list */}
      <Collapse in={open}>
        <Box mt={2}>
          {services.map(service => (
            <Card key={service.id} sx={{ borderRadius: 0, borderBottom: '1px dashed #ccc' }}>
              <CardContent>
                <Typography variant="h6">{service.name}</Typography>
                <Typography variant="body2">{service.description}</Typography>
                <Typography variant="body2">${service.price} • {service.duration}</Typography>
                <Button onClick={() => onSelect(service)} sx={{ mt: 1 }}>Book</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
