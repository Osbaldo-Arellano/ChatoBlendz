'use client';

import { Box, Typography, Link, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #eee',
        py: 2,
        px: 2,
        mt: 4,
        textAlign: 'center',
        maxWidth: "100%",
        mx: 'auto',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} ChatoBlendz. All rights reserved.
      </Typography>

      <Box display="flex" justifyContent="center" gap={1}>
        <IconButton
          component="a"
          href="https://www.instagram.com/chatoblndz_/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon fontSize="small" />
        </IconButton>

        <IconButton
          component="a"
          href="mailto:bookings@chatoblendz.com"
          aria-label="Email"
        >
          <EmailIcon fontSize="small" />
        </IconButton>
      </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
  );
}
