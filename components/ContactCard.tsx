'use client';

import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Link,
  Paper,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

export default function ContactCard() {
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        px: 4,
        py: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: 'white',
      }}
    >
      {/* Profile Image */}
      <Avatar
        alt="Barber profile"
        src="/images/chato.png"
        sx={{
          width: 130,
          height: 130,
          mb: 2,
          border: '3px solid black',
        }}
      />

      {/* Title and subtitle */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: 'black', textAlign: 'center', mb: 0.5 }}
      >
        ChatoBlendz
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'black', textAlign: 'center', mb: 3 }}
      >
        Mario Bonilla, Professionally Trained Hair Stylist
      </Typography>

      {/* Contact info */}
      <Box display="flex" alignItems="center" mb={1}>
        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'black' }} />
        <Typography variant="body2" sx={{ color: 'black' }}>
          (503) XXX-XXXX
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mb={1}>
        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'black' }} />
        <Typography variant="body2" sx={{ color: 'black' }}>
          bookings@chatoblendz.com
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mb={2}>
        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'black' }} />
        <Typography variant="body2" sx={{ color: 'black' }}>
          Woodburn, Oregon
        </Typography>
      </Box>

      {/* Socials */}
      <Box display="flex" gap={1} mt={1}>
        <IconButton
          component={Link}
          href="https://instagram.com/chatoblendz"
          target="_blank"
          rel="noopener"
          sx={{
            color: 'black',
            '&:hover': {
              color: '#E1306C', // Instagram pink
            },
          }}
        >
          <InstagramIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
