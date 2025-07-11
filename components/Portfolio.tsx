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
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';

const imageList = [
  '/images/2.jpg',
  '/images/4.jpg',
  '/images/3.jpg',
  '/images/5.jpg',
  '/images/1.jpg',
  '/images/6.jpg',
];

const videoList = [
  '/videos/clip1.mp4',
  '/videos/clip2.mp4',
  '/videos/clip3.mp4',
  '/videos/clip4.mp4',
];

const IMAGES_PER_LOAD = 5;
const VIDEOS_PER_LOAD = 2;

export default function GalleryList() {
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [videosOpen, setVideosOpen] = useState(false);
  const [visibleImageCount, setVisibleImageCount] = useState(IMAGES_PER_LOAD);
  const [visibleVideoCount, setVisibleVideoCount] = useState(VIDEOS_PER_LOAD);

  const handleLoadMoreImages = () => {
    setVisibleImageCount((prev) => prev + IMAGES_PER_LOAD);
  };

  const handleLoadMoreVideos = () => {
    setVisibleVideoCount((prev) => prev + VIDEOS_PER_LOAD);
  };

  const visibleImages = imageList.slice(0, visibleImageCount);
  const visibleVideos = videoList.slice(0, visibleVideoCount);

  return (
    <Box>
      {/*  Gallery Header  */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setGalleryOpen(!galleryOpen)}
        sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Photos</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">Don&lsquo;t blink</Typography>
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

      {/*  Gallery Images Section  */}
      <Collapse in={galleryOpen}>
        <Box display="flex" flexDirection="column" sx={{mx: 1, my: 2}}>
          {visibleImages.map((src, idx) => (
            <Card key={idx} sx={{ overflow: 'hidden',  borderRadius:2 }}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '133%',
                  backgroundColor: '#f0f0f0',
                }}
              >
                <CardMedia
                  component="img"
                  image={src}
                  alt={`Gallery image ${idx + 1}`}
                  sx={{
                    position: 'absolute',
                    top: 3,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

            </Card>
          ))}
        </Box>

        {/* Load More Images */}
        {visibleImageCount < imageList.length && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="outlined" size="small" onClick={handleLoadMoreImages}>
              Load More
            </Button>
          </Box>
        )}
      </Collapse>

      {/* === Videos Header === */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setVideosOpen(!videosOpen)}
        sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Videos</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">Real cuts, real time</Typography>
        </Box>
        <IconButton size="small">
          <ExpandMoreIcon
            sx={{
              transform: videosOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* === Video Section === */}
      <Collapse in={videosOpen}>
        <Box display="flex" flexDirection="column" gap={2}>
          {visibleVideos.map((src, idx) => (
            <Card key={idx} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '177%',
                  backgroundColor: '#000',
                }}
              >
                <CardMedia
                  component="video"
                  src={src}
                  controls
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
            </Card>
          ))}
        </Box>

        {/* Load More Videos */}
        {visibleVideoCount < videoList.length && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="outlined" size="small" onClick={handleLoadMoreVideos}>
              Load More
            </Button>
          </Box>
        )}
      </Collapse>
    </Box>
  );
}
