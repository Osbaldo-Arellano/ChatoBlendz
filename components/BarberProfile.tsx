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
import ShareIcon from '@mui/icons-material/Share';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import client  from '@/lib/sanityClient'; 
import Image from 'next/image';

const fallbackGalleryImages = [
  '/images/haircut1.jpg',
  '/images/haircut2.jpg',
  '/images/haircut3.jpg',
];

export default function BarberProfile() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [sliderRef, setSliderRef] = useState<any>(null);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);

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

          if (urls.length === 0) {
            console.warn('Sanity returned no gallery images. Using fallback.');
            setGalleryImages(fallbackGalleryImages);
          } else {
            setGalleryImages(urls);
          }
        } catch (err) {
          console.error('Sanity fetch failed. Using fallback gallery.', err);
          setGalleryImages(fallbackGalleryImages);
        }
      }

      fetchGallery();
    }, []);


    const handleShare = async () => {
    try {
        if (navigator.share) {
        await navigator.share({
            title: 'Book ChatoBlendz',
            text: 'TAP IN!',
            url: window.location.href,
        });
        setSnackbarOpen(true);
        } else {
        alert('Sharing is not supported on this browser.');
        }
    } catch (err) {
        console.error('Sharing failed:', err);
    }
    };

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
      maxWidth: 600,
      mx: 'auto',
      pb: 2,
      mb: 2
    }}
  >
    {/* Gallery with Overlays */}
    <Box sx={{ position: 'relative' }}>
    <Slider {...sliderSettings} ref={(slider) => setSliderRef(slider)}>
        {galleryImages.length === 0 ? (
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
        galleryImages.map((img, idx) => (
            <Box
            key={idx}
            sx={{
                height: 260,
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            />
        ))
        )}
    </Slider>

    {/* Arrows overlayed */}
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

    {/* Instagram button top-right */}
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
        <Chip
          label="Full Service Barber"
          size="small"
          sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
        />
        <Chip
          label="Fades"
          size="small"
          sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
        />
        <Chip
          label="Tapers"
          size="small"
          sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
        />
        <Chip
          label="Shears"
          size="small"
          sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
        />
        <Chip
          label="Face Tune Up"
          size="small"
          sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
        />
        <Chip
          label="Beards"
          size="small"
          sx={{ mb: 1, backgroundColor: '#f1f1f1', fontWeight: '500' }}
        />
        <Box display="flex" justifyContent="right" alignItems="right">
          <Box display="flex" alignItems="right" gap={1}>
            {/* Details Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center'}}>
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

            <Tooltip title="Share this page">
              <IconButton
                aria-label="Share"
                onClick={handleShare}
                sx={{
                  '&:active': { transform: 'scale(0.95)' },
                  transition: 'transform 0.1s ease-in-out',
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Call now">
              <IconButton component="a" href="tel:+17145551234">
                <PhoneIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
        </Box>
        
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Thanks for sharing!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
