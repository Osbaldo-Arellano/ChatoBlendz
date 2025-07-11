'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const disclaimers = [
  'Please arrive 5 minutes early.',
  'No-shows may result in a 50% charge.',
  'Cancellations must be made at least 4 hours in advance.',
];

export default function Disclaimers() {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', mb: 1, ml: 1, mt: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">Disclaimers</Typography>
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">Policies & Notes</Typography>
        </Box>
        <IconButton size="small">
          <ExpandMoreIcon
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box mt={2}>
          {disclaimers.map((note, idx) => (
            <Card key={idx} sx={{ borderRadius: 0, borderBottom: '1px dashed #ccc' }}>
              <CardContent sx={{ py: 2 }}>
                <Grid container>
                  <Grid>
                    <Typography variant="body2" color="text.secondary">
                      {note}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
