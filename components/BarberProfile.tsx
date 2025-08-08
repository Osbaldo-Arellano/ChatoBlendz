'use client';

import { useState, useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
  Divider,
  Popover,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/PhoneTwoTone';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import EastIcon from '@mui/icons-material/East';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MapIcon from '@mui/icons-material/MapTwoTone';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import client from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import loadingAnimation from "@/lottiefiles/Barber's Pole.json";

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then((m) => m.Player), {
  ssr: false,
});

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).url();

export default function BarberProfile() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [sliderRef, setSliderRef] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [stripImages, setStripImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Promo (optional) — falls back to null if nothing found
  const [promo, setPromo] = useState<string | null>(null);

  // About popover
  const [aboutAnchor, setAboutAnchor] = useState<HTMLElement | null>(null);
  const aboutOpen = Boolean(aboutAnchor);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Header carousel
        const headerQ = `*[_type == "gallery" && title == "Header"][0].images`;
        const headerImages = await client.fetch(headerQ);

        // Strip images (use a different set if you have one; else fall back to header)
        const stripQ = `*[_type == "gallery" && title == "Featured Cuts"][0].images`;
        const strip = await client.fetch(stripQ);

        // Promo
        const promoQ = `*[_type == "announcement" && isActive == true][0].message`;
        const promoMsg = await client.fetch(promoQ);

        if (Array.isArray(headerImages)) {
          setGalleryImages(headerImages.map((img: any) => urlFor(img.asset)));
        }
        if (Array.isArray(strip) && strip.length) {
          setStripImages(strip.map((img: any) => urlFor(img.asset)));
        } else {
          // fallback to header images if no strip doc
          setStripImages((headerImages || []).map((img: any) => urlFor(img.asset)));
        }

        setPromo(typeof promoMsg === 'string' && promoMsg.trim() ? promoMsg.trim() : null);
      } catch {
        // passive fallbacks
        setGalleryImages([]);
        setStripImages([]);
        setPromo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const sliderSettings = useMemo(
    () => ({
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
            opacity: 0.9,
          }}
        />
      ),
    }),
    [],
  );

  const sliderHeight = isMdUp ? 400 : 260;

  const handleAboutEnter = (e: React.MouseEvent<HTMLElement>) => setAboutAnchor(e.currentTarget);
  const handleAboutClose = () => setAboutAnchor(null);

  return (
    <Box sx={{ background: 'white', mx: 'auto', pb: 3 }}>
      {/* ====== TOP: GALLERY ====== */}
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

        {/* Arrows (desktop only) */}
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

      {/* ====== DETAILS BAR ====== */}
      <Box px={{ xs: 2, md: 3 }} pt={2}>
        {/* skills/traits chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
          {['Full Service Barber', 'Fades', 'Tapers', 'Shears', 'Beards'].map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                backgroundColor: '#f1f1f1',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>

        {/* promo banner (optional) */}
        {promo && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.75,
              mb: 1.5,
              borderRadius: 999,
              bgcolor: 'black',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            🎉 {promo}
          </Box>
        )}

        {/* Row: logo + tagline + rating + actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-end', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            mt: 5,
          }}
        >
          {/* Left chunk: logo + tagline + rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 520px' }}>
            <Image src="/images/client.png" alt="ChatoBlendz logo" width={150} height={100} />

            <Box sx={{ display: 'grid', gap: 0.75 }}>
              {/* tagline */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'linear-gradient(to right, rgba(255,255,255,0), #f6f6f6)',
                  borderRadius: 2,
                  py: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.4rem', sm: '1.6rem', md: '2rem', lg: '2.3rem' },
                    fontWeight: 700,
                    fontFamily: '"Playfair Display", serif',
                    color: '#222',
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(to right, #000, #555)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    paddingBottom: '0.5rem',
                    position: 'relative',
                    width: '100%',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: '100%',
                      height: '3px',
                      background: 'linear-gradient(to right, transparent, #000, transparent)',
                    },
                  }}
                >
                  Proudly serving the Salem, Woodburn, and Portland areas.
                </Typography>

                <Tooltip title="About the shop">
                  <IconButton
                    size="small"
                    onMouseEnter={handleAboutEnter}
                    onClick={handleAboutEnter}
                    sx={{ color: 'text.secondary' }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* rating / reviews */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  5 Stars
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
                <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
                <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
                <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
                <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  100+ clients
                </Typography>
              </Box>

              <Box
                sx={{ display: 'flex', gap: 2, flexShrink: 0, justifyContent: 'center', mt: 0.5 }}
              >
                <Tooltip title="Get Directions">
                  <IconButton
                    component="a"
                    href="geo:0,0?q=ChatoBlendz, Salem OR"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: '#1565c0',
                      color: 'white',
                      borderRadius: 3,
                      '&:hover': { bgcolor: '#1565c0' },
                      boxShadow: '0 3px 4px rgba(0,0,0,0.1)',
                      borderBottom: '1px solid grey',
                    }}
                  >
                    <Typography
                      color="text.primary"
                      sx={{ maxWidth: 360, color: 'white', fontWeight: 550 }}
                    >
                      Directions
                    </Typography>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Call Me">
                  <IconButton
                    component="a"
                    href="tel:+17145551234"
                    sx={{
                      bgcolor: '#1565c0',
                      boxShadow: '0 3px 4px rgba(0,0,0,0.1)',
                      borderBottom: '1px solid grey',
                      color: 'white',
                      borderRadius: 3,
                      '&:hover': { bgcolor: 'grey.900' },
                    }}
                  >
                    <PhoneIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* About popover */}
        <Popover
          open={aboutOpen}
          anchorEl={aboutAnchor}
          onClose={handleAboutClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { px: 2, py: 1.5, borderRadius: 2 } }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            Same-day bookings when available. Walk in scruffy, walk out sharp. Go to my contact page
            to call me directly.
          </Typography>
        </Popover>
      </Box>
    </Box>
  );
}
