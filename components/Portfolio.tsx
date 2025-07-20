'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardMedia, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import imageUrlBuilder from '@sanity/image-url';
import client from '@/lib/sanityClient';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

// Dynamic import to prevent SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import barberPole from "@/lottiefiles/Barber's Pole.json"; // replace with your actual path

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source).url();
}

const IMAGES_PER_LOAD = 5;

export default function GalleryList() {
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [visibleImageCount, setVisibleImageCount] = useState(IMAGES_PER_LOAD);
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  // Inside your component
  const imageRefs = useRef<Record<number, HTMLImageElement | null>>({});

  // When images update (or on mount), check if any images are already loaded
  useEffect(() => {
    Object.entries(imageRefs.current).forEach(([index, img]) => {
      if (img && img.complete) {
        handleImageLoad(Number(index));
      }
    });
  }, [images]);

  useEffect(() => {
    const fetchImages = async () => {
      const query = `*[_type == "gallery" && title == "Portfolio"][0].images`;
      const result = await client.fetch(query);

      if (result && Array.isArray(result)) {
        const urls = result.map((img: any) => urlFor(img.asset));
        setImages(urls);

        // Initialize loading state for each image
        const initialLoadingState: Record<number, boolean> = {};
        urls.forEach((_, idx) => {
          initialLoadingState[idx] = true;
        });
        setLoadingImages(initialLoadingState);
      }
    };

    fetchImages();
  }, []);

  const handleLoadMoreImages = () => {
    setVisibleImageCount((prev) => prev + IMAGES_PER_LOAD);
  };

  const handleImageLoad = (idx: number) => {
    setLoadingImages((prev) => ({ ...prev, [idx]: false }));
  };

  const visibleImages = images.slice(0, visibleImageCount);

  return (
    <Box>
      {/* Photos Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setGalleryOpen(!galleryOpen)}
        sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">
            Photos
          </Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
            Don&apos;t blink
          </Typography>
        </Box>
        <IconButton size="small">
          <ExpandMoreIcon
            sx={{
              transform: galleryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* Images Section */}
      <Collapse in={galleryOpen}>
        <Box display="flex" flexDirection="column" sx={{ mx: 1, my: 2 }}>
          {visibleImages.map((src, idx) => (
            <Card key={idx} sx={{ overflow: 'hidden', borderRadius: 2 }}>
              <Box sx={{ position: 'relative', paddingTop: '133%', backgroundColor: '#f0f0f0' }}>
                {loadingImages[idx] && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'white',
                      zIndex: 1,
                    }}
                  >
                    <Lottie
                      animationData={barberPole}
                      loop
                      autoplay
                      style={{ width: 100, height: 100 }}
                    />
                  </Box>
                )}

                <CardMedia
                  component="img"
                  image={src}
                  alt={`Gallery image ${idx + 1}`}
                  onLoad={() => handleImageLoad(idx)}
                  onError={() => handleImageLoad(idx)}
                  ref={(el) => { imageRefs.current[idx] = el; }}
                  sx={{
                    position: 'absolute',
                    top: 3,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: loadingImages[idx] ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                />


              </Box>
            </Card>
          ))}
        </Box>

        {visibleImageCount < images.length && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="outlined" size="small" onClick={handleLoadMoreImages}>
              Load More
            </Button>
          </Box>
        )}
      </Collapse>
    </Box>
  );
}
