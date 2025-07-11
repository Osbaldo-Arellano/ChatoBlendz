'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const highlights = [
  {
    name: "Skin Fade + Beard Trim",
    description: "Our most booked service — includes razor finish and hot towel.",
    price: 30,
    duration: "1hr 30min",
  },
  {
    name: "Premium Full Service",
    description: "Haircut, beard sculpting, and black mask treatment.",
    price: 40,
    duration: "2hr",
  },
];

export default function HighlightList({ onSelect }: { onSelect: (service: any) => void }) {
  const [open, setOpen] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Barber&apos;s Specials</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">🔥 Hand-picked Cuts</Typography>
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

      <Collapse in={open}>
        <Box mt={2}>
          {highlights.map((item, idx) => (
            <Card key={idx} sx={{ borderRadius: 0, borderBottom: '1px dashed #ccc' }}>
              <CardContent sx={{ py: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 7, sm: 5 }}>
                    <Typography fontWeight="bold">{item.name}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', mt: 0.5 }}
                      onClick={() => setSelectedDescription(item.description)}
                    >
                      ...
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 5, sm: 5 }}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      gap={1}
                      flexWrap="wrap"
                    >
                      <Box>
                        <Typography fontWeight="bold">${item.price.toFixed(2)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.duration}
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                        onClick={() => onSelect(item)}
                      >
                        Book
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Dialog open={!!selectedDescription} onClose={() => setSelectedDescription(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Description</DialogTitle>
            <DialogContent>
              <Typography>{selectedDescription}</Typography>
            </DialogContent>
          </Dialog>
        </Box>
      </Collapse>
    </Box>
  );
}
