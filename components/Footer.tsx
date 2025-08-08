'use client';

import { Box, Typography, Link, IconButton, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #eee',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 6 },
        mt: 4,
        maxWidth: '100%',
      }}
    >
      {/* Flex container that stacks on mobile and rows on desktop */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 4 }}
        justifyContent="space-between"
        alignItems="center"
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
      >
        {/* Left Side */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 0 } }}>
            © {new Date().getFullYear()} ChatoBlendz. All rights reserved.
          </Typography>
        </Box>

        {/* Middle (social icons) */}
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            component="a"
            href="https://www.instagram.com/chatoblndz_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            sx={{ p: 1.2 }} // tap-friendly
          >
            <InstagramIcon fontSize="medium" />
          </IconButton>

          <IconButton
            component="a"
            href="mailto:bookings@chatoblendz.com"
            aria-label="Email"
            sx={{ p: 1.2 }}
          >
            <EmailIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* Right Side */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            Website designed and coded by{' '}
            <Link
              href="https://xicanoweb.carrd.co/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              Xicano Web Services
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
