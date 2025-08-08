'use client';

import { useState, useEffect } from 'react';
import client from '@/lib/sanityClient';
import {
  Box,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

// List loading animation
import listLoadingAnimation from "@/lottiefiles/Barber's Pole.json";

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((m) => m.Player), {
  ssr: false,
});

const fallbackServices = [
  { name: 'Fade!', description: 'A crispy fade...', price: 25, duration: '1hr' },
  { name: 'Mid Fade', description: 'High enough...', price: 25, duration: '1hr' },
  { name: 'Taper', description: 'You’ll walk out...', price: 25, duration: '1hr' },
  { name: 'Fade + Face Cleanup', description: 'Fresh fade...', price: 30, duration: '1hr 30m' },
  { name: 'Fade + Beard', description: 'Whole package...', price: 30, duration: '1hr 30min' },
  { name: 'Shears', description: 'Precision over...', price: 25, duration: '1hr' },
];

export default function ServiceList({ onSelect }: { onSelect: (service: any) => void }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await client.fetch(`
          *[_type == "service"] | order(_createdAt asc) {
            _id,
            name,
            description,
            price,
            duration,
            image {
              asset -> { url }
            }
          }
        `);
        setServices(data?.length ? data : fallbackServices);
      } catch (err) {
        console.error('Sanity fetch failed, using fallback services:', err);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const openDialog = (service: any) => {
    setSelectedService(service);
    // Only show the image loader if there is an image to load
    setImgLoading(!!service?.image?.asset?.url);
  };

  const closeDialog = () => {
    setSelectedService(null);
    setImgLoading(false);
  };

  return (
    <Box mt={3}>
      <Box mb={2} ml={1}>
        <Typography variant="h6" fontWeight="bold" color="text.secondary">
          Services
        </Typography>
        <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
          Tap In!
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <Player autoplay loop src={listLoadingAnimation} style={{ height: 120, width: 120 }} />
        </Box>
      ) : (
        services.map((service) => (
          <Box
            key={service._id || service.name}
            sx={{ borderBottom: '1px solid #e0e0e0', paddingX: 2, paddingY: 1.5 }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ width: '100%' }} // ensure full width
            >
              {/* Left column — 2/3 on md+ */}
              <Grid size={{ xs: 8, md: 8 }}>
                <Typography fontWeight="bold" color="text.primary">
                  {service.name}
                </Typography>

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
                  {service.description}
                </Typography>

                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', mt: 0.5 }}
                  onClick={() => openDialog(service)}
                >
                  Learn More
                </Typography>
              </Grid>

              {/* Right column — 1/3 on md+ */}
              <Grid
                size={{ xs: 1, sm: 1, md: 4 }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'space-between', md: 'flex-end' },
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography fontWeight="bold" color="text.primary">
                    ${Number(service.price).toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {service.duration}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => onSelect(service)}
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#222' },
                  }}
                >
                  Book
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))
      )}
      {/* Dialog for description + optional image with Lottie while loading */}
      <Dialog open={!!selectedService} onClose={closeDialog} maxWidth="sm" fullWidth>
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '1rem',
            bgcolor: 'none',
            color: 'black',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            px: 2,
            py: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -3,
                width: '100%',
                height: '2px',
                backgroundColor: 'black',
                borderRadius: '2px',
              },
            }}
          >
            {selectedService?.name || 'Description'}
          </Box>{' '}
          <Button
            onClick={closeDialog}
            sx={{
              minWidth: 'auto',
              color: 'black',
              borderRadius: '50%',
              p: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Image */}
          {selectedService?.image?.asset?.url && (
            <Box
              sx={{ position: 'relative', width: '100%', aspectRatio: '5/7', bgcolor: '#f5f5f5' }}
            >
              <Image
                src={selectedService.image.asset.url}
                alt={selectedService.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}

          {/* Details */}
          <Box sx={{ p: 2, flex: '1 1 auto' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {selectedService?.description}
            </Typography>

            {/* Price + duration pill row */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#000',
                  color: '#fff',
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                ${Number(selectedService?.price || 0).toFixed(2)}
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#e5e5e5',
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                {selectedService?.duration}
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '5px',
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'uppercase',
                '&:hover': { backgroundColor: '#222' },
              }}
              onClick={() => {
                onSelect(selectedService);
                closeDialog();
              }}
            >
              Book Now
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
