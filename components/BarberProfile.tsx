'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton, Chip, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import client from '@/lib/sanityClient';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import loadingAnimation from "@/lottiefiles/Barber's Pole.json";
import imageUrlBuilder from '@sanity/image-url';

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), {
  ssr: false,
});

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).url();

export default function BarberProfile() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [sliderRef, setSliderRef] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const query = `*[_type == "gallery" && title == "Header"][0].images`;
      const result = await client.fetch(query);
      if (Array.isArray(result)) {
        setGalleryImages(result.map((img: any) => urlFor(img.asset)));
      }
      setLoading(false);
    };
    fetchImages();
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
          display: 'flex',
          gap: '4px',
          listStyle: 'none',
          m: 0,
          p: 0,
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
          bgcolor: '#fff',
          opacity: 0.8,
        }}
      />
    ),
  };

  const sliderHeight = isMdUp ? 400 : 260;

  return (
    <Box sx={{ background: 'white', mx: 'auto', pb: 3 }}>
      {/* Gallery */}
      <Box sx={{ position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              height: sliderHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#eee',
            }}
          >
            <Player autoplay loop src={loadingAnimation} style={{ height: 120, width: 120 }} />
          </Box>
        ) : galleryImages.length === 0 ? (
          <Box
            sx={{
              height: sliderHeight,
              bgcolor: '#eee',
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
                  height: sliderHeight,
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </Slider>
        )}

        {/* Arrows only on desktop */}
        {!loading && galleryImages.length > 0 && isMdUp && (
          <>
            <IconButton
              onClick={() => sliderRef?.slickPrev()}
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                width: 40,
                height: 40,
                boxShadow: 1,
                zIndex: 2,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => sliderRef?.slickNext()}
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                width: 40,
                height: 40,
                boxShadow: 1,
                zIndex: 2,
                '&:hover': { bgcolor: 'grey.100' },
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
            bgcolor: 'rgba(0, 0, 0, 0.7)',
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
            sx={{ color: 'white', p: 0.5 }}
          >
            <InstagramIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>

      {/* Details */}
      <Box px={{ xs: 2, md: 3 }} pt={2}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            mb: 2,
          }}
        >
          {['Full Service Barber', 'Fades', 'Tapers', 'Shears', 'Face Tune Up', 'Beards'].map(
            (label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{
                  backgroundColor: '#f1f1f1',
                  fontWeight: 500,
                }}
              />
            ),
          )}
        </Box>

        {/* Row layout even on mobile */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Image src="/images/client.png" alt="Client Logo" width={110} height={110} />
            <Box
              sx={{
                display: 'inline-flex', // so the background only wraps content width
                alignItems: 'center',
                gap: 2,
                background: 'linear-gradient(to right, rgba(255,255,255,0), #f5f5f5)', // fade from transparent to grey
                borderRadius: 2, // 16px radius (can also use '8px' if you want smaller)
                px: 2, // horizontal padding inside background
                py: 1, // vertical padding inside background
              }}
            >
              <Typography
                sx={{
                  color: 'text.primary', // darker for better contrast
                  fontSize: { xs: 15, md: 17 },
                  fontWeight: 50, // bolder
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // cleaner modern font
                  lineHeight: 1.4,
                  whiteSpace: 'normal',
                }}
              >
                Proudly serving the Salem, Woodburn, and Portland areas.
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Call now">
            <Box
              component="a"
              href="tel:+17145551234"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'black',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 700,
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: 12,
                borderRadius: '5px',
                width: 70,
                height: 38,
                flexShrink: 0, // prevent shrinking
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  bgcolor: 'grey.900',
                },
              }}
            >
              CALL&nbsp;ME
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
