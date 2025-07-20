'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import client from '@/lib/sanityClient';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);
import loadingAnimation from "@/lottiefiles/Barber's Pole.json"; 


export default function BarberProfile() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sliderRef, setSliderRef] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await client.fetch(`
          *[_type == "gallery"] {
            images[]{ asset->{ url } }
          }
        `);

        const urls = Array.from(
          new Set(
            data
              .flatMap((gallery: any) => gallery.images || [])
              .map((img: any) => img.asset?.url)
              .filter(Boolean)
          )
        );

        setGalleryImages(urls);
      } catch (err) {
        console.error('Sanity fetch failed.', err);
        setGalleryImages([]); 
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    appendDots: (dots: React.ReactNode) => (
      <Box
        component="ul"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 12,
          m: 0,
          p: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '4px',
          listStyle: 'none',
          zIndex: 2,
        }}
      >
        {dots}
      </Box>
    ),
    customPaging: () => (
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#fff',
          opacity: 0.8,
        }}
      />
    ),
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom,rgb(151, 151, 151),rgb(255, 255, 255))',
        mx: 'auto',
        pb: 3,
      }}
    >
      {/* Gallery with Loader */}
      <Box sx={{ position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              height: 260,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#eee'
            }}
          >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
            <Player
              autoplay
              loop
              src={loadingAnimation}
              style={{ height: 120, width: 120 }}
            />
          </Box>
          </Box>
        ) : galleryImages.length === 0 ? (
          <Box
            sx={{
              height: 260,
              backgroundColor: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">No images found.</Typography>
          </Box>
        ) : (
          <Slider {...sliderSettings} ref={(slider) => setSliderRef(slider)}>
            {galleryImages.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  height: 260,
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </Slider>
        )}

        {/* Arrows */}
        {!loading && galleryImages.length > 0 && (
          <>
            <IconButton
              onClick={() => sliderRef?.slickPrev()}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'white',
                width: 32,
                height: 32,
                zIndex: 2,
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => sliderRef?.slickNext()}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'white',
                width: 32,
                height: 32,
                zIndex: 2,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}

        {/* Instagram button */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
          }}
        >
          <IconButton
            aria-label="Instagram"
            href="https://www.instagram.com/chatoblndz_/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              p: 0.5,
            }}
          >
            <InstagramIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>

      {/* Details Section */}
      <Box px={2} pt={2}>
        {['Full Service Barber', 'Fades', 'Tapers', 'Shears', 'Face Tune Up', 'Beards', 'Hair Enhancements'].map((label) => (
          <Chip
            key={label}
            label={label}
            size="small"
            sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
          />
        ))}

        <Box display="flex" justifyContent="right" alignItems="right">
          <Box display="flex" alignItems="right" gap={1}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  src="/images/client.png"
                  alt="Client Logo"
                  width={125}
                  height={125}
                />
              </Box>
            </Box>
            <Typography color="text.secondary" fontSize="14px">
              Serving the Salem, Woodburn, and Portland area.
            </Typography>

            <Tooltip title="Call now">
              <IconButton component="a" href="tel:+17145551234">
                <PhoneIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
