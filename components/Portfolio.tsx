'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';

const allImages = [
  '/images/portfolio1.jpg',
  '/images/portfolio2.jpg',
  '/images/portfolio3.jpg',
  '/images/portfolio4.jpg',
  '/images/portfolio5.jpg',
  '/images/portfolio6.jpg',
  '/images/portfolio7.jpg',
  '/images/portfolio8.jpg',
  '/images/portfolio9.jpg',
  '/images/portfolio10.jpg',
]; 

const IMAGES_PER_LOAD = 5;

export default function Portfolio() {
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_LOAD);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + IMAGES_PER_LOAD);
  };

  const visibleImages = allImages.slice(0, visibleCount);

  return (
    <Box px={2} mx="auto">
      <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Gallery</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">See my work!</Typography>
        </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {visibleImages.map((src, idx) => (
          <Card key={idx} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Phone-ratio container */}
            <Box
              sx={{
                position: 'relative',
                paddingTop: '133%', // 3:4 ratio
                backgroundColor: '#f0f0f0',
              }}
            >
              <CardMedia
                component="img"
                image={src}
                alt={`Portfolio image ${idx + 1}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                px: 1,
                py: 0.5,
                backgroundColor: '#fafafa',
              }}
            >
              <IconButton size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
              <Box display="flex" alignItems="center" gap={1}>
                <ChatBubbleOutlineIcon fontSize="small" />
                <Typography variant="caption">0</Typography>
                <FavoriteBorderIcon fontSize="small" />
                <Typography variant="caption">0</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {visibleCount < allImages.length && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="outlined" size="small" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}
