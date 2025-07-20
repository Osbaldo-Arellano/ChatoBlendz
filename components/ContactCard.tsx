'use client';

import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Link,
  Paper,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function ContactCard() {
  return (
    <>
    <Box display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3  }}>
      <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Contact Me</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary"></Typography>
      </Box>
    </Box>

    <Divider />

    <Paper
      sx={{
        mx: 'auto',
        px: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'none',
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
        </>
  );
}
