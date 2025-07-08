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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Grid from '@mui/material/Grid';


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
        sx={{ cursor: 'pointer', mb: 1, ml:1 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Services</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">Tap In!</Typography>
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
                <CardContent sx={{ py: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Left: Service name & description */}
                    <Grid size={{ xs: 9, sm: 9 }}>
                    <Typography fontWeight="bold">{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {service.description}
                    </Typography>
                    </Grid>

                    {/* Right: Price + duration + Book */}
                    <Grid size={{ xs: 1, sm: 1 }}>
                    <Box
                        display="flex"
                        justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                    >
                        <Box>
                        <Typography fontWeight="bold">${service.price.toFixed(2)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {service.duration}
                        </Typography>
                        </Box>
                        
                        <Button
                        size="small"
                        variant="contained"
                        onClick={() => onSelect(service)}
                        sx={{ textTransform: 'none' }}
                        >
                        Book
                        </Button>
                    </Box>
                    </Grid>
                </Grid>
                </CardContent>

            </Card>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
