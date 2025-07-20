'use client';

import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);
import loadingAnimation from "@/lottiefiles/Barber's Pole.json"; 


const fallbackSpecials = [
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
  const [specials, setSpecials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecials() {
      try {
        const data = await client.fetch(`
          *[_type == "specials"][0]{
            services[]->{
              _id,
              name,
              description,
              price,
              duration
            }
          }
        `);

        if (!data?.services || data.services.length === 0) {
          setSpecials(fallbackSpecials);
        } else {
          setSpecials(data.services);
        }
      } catch (error) {
        console.error("Sanity fetch failed, using fallback specials:", error);
        setSpecials(fallbackSpecials);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecials();
  }, []);

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
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">Specialty Cuts</Typography>
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
          {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <Player
            autoplay
            loop
            src={loadingAnimation}
            style={{ height: 120, width: 120 }}
          />
        </Box>
          ) : (
            specials.map(special => (
              <Card key={special._id || special.name} sx={{ borderRadius: 0, borderBottom: '1px dashed #ccc' }}>
                <CardContent sx={{ py: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 7, sm: 5 }}>
                      <Typography fontWeight="bold">{special.name}</Typography>
                      <Box>
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
                          {special.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', mt: 0.5 }}
                          onClick={() => setSelectedDescription(special.description)}
                        >
                          ...
                        </Typography>
                      </Box>
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
                          <Typography fontWeight="bold">${special.price.toFixed(2)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {special.duration}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onSelect(special)}
                          sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#222',
                            },
                            '&:disabled': {
                              backgroundColor: '#555',
                              color: 'white',
                            },
                          }}
                        >
                          Book
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}

          <Dialog
            open={!!selectedDescription}
            onClose={() => setSelectedDescription(null)}
            maxWidth="sm"
            fullWidth
          >
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
