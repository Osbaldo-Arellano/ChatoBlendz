'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import client from '@/lib/sanityClient';

type SanityService = {
  _id: string;
  name: string;
  description?: string;
  price?: number; // assume number in Sanity; adjust if string
  duration?: string | number; // e.g., "1hr 30m" or 90
};

type UiService = {
  id: string;
  name: string;
  price?: number;
  durationMin?: number; // normalized minutes
};

function parseDurationToMinutes(v: unknown): number | undefined {
  if (v == null) return undefined;

  // number -> assume minutes
  if (typeof v === 'number' && !Number.isNaN(v)) return v;

  if (typeof v !== 'string') return undefined;
  const s = v.toLowerCase().trim();

  // "90" or "90m"
  const justNum = s.match(/^(\d+)\s*m?$/);
  if (justNum) return parseInt(justNum[1], 10);

  // "1:30" -> 90
  const hhmm = s.match(/^(\d+)\s*:\s*(\d{1,2})$/);
  if (hhmm) return parseInt(hhmm[1], 10) * 60 + parseInt(hhmm[2], 10);

  // "1h 30m", "1 hr 30 min", "2hours", "45m", "1hr"
  const h = s.match(/(\d+)\s*h/);
  const m = s.match(/(\d+)\s*m/);
  const hours = h ? parseInt(h[1], 10) : 0;
  const mins = m ? parseInt(m[1], 10) : 0;
  if (hours || mins) return hours * 60 + mins;

  return undefined;
}

export default function AdminCreateAppointmentButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);

  // fetched services from Sanity
  const [services, setServices] = useState<UiService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [durationMin, setDurationMin] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [smsReminder, setSmsReminder] = useState(true);

  const [date, setDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await client.fetch<SanityService[]>(`
          *[_type == "service"] | order(_createdAt asc) {
            _id, name, description, price, duration
          }
        `);

        const normalized: UiService[] = (data || []).map((s) => ({
          id: s._id,
          name: s.name,
          price: typeof s.price === 'number' ? s.price : undefined,
          durationMin: parseDurationToMinutes(s.duration),
        }));

        setServices(normalized);
      } catch (e) {
        console.error('Failed to fetch services from Sanity:', e);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    })();
  }, []);

  const selected = useMemo(
    () => services.find((s) => s.name === serviceName),
    [services, serviceName],
  );

  function handleServiceChange(val: string) {
    setServiceName(val);
    const svc = services.find((s) => s.name === val);
    if (svc?.durationMin && !durationMin) setDurationMin(svc.durationMin);
    if (typeof svc?.price === 'number' && price === '') setPrice(svc.price);
  }

  const disabled =
    !name || !serviceName || !date || !startTime || !durationMin || Number(durationMin) <= 0;

  async function handleCreate() {
    if (disabled) return;

    const d = dayjs(date!);
    const st = dayjs(startTime!);
    const start = d.hour(st.hour()).minute(st.minute()).second(0);
    const end = start.add(Number(durationMin), 'minute');

    const payload = {
      name,
      service_name: serviceName,
      date: start.format('YYYY-MM-DD'),
      start_time: start.format('h:mm A'),
      end_time: end.format('h:mm A'),
      phone_number: phone || undefined,
      price: price === '' ? undefined : Number(price),
      addons: [],
      total_price: price === '' ? undefined : Number(price),
      sms_reminder: smsReminder ? 'true' : 'false',
    };

    const res = await fetch('/api/admin/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Failed to create appointment${err?.error ? `: ${err.error}` : ''}`);
      return;
    }

    onSuccess();
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ borderRadius: 1, m: 2, textTransform: 'none', fontWeight: 700 }}
      >
        Create Appointment
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Create Appointment</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Client Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label={loadingServices ? 'Loading services…' : 'Service'}
              value={serviceName}
              onChange={(e) => handleServiceChange(e.target.value)}
              fullWidth
              disabled={loadingServices}
            >
              {services.length === 0 ? (
                <MenuItem value="">(No services found in Sanity)</MenuItem>
              ) : (
                services.map((s) => (
                  <MenuItem key={s.id} value={s.name}>
                    {s.name}
                    {typeof s.price === 'number' ? ` — $${s.price.toFixed(2)}` : ''}
                    {typeof s.durationMin === 'number' ? ` (${s.durationMin} min)` : ''}
                  </MenuItem>
                ))
              )}
            </TextField>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <DatePicker label="Date" value={date} onChange={(newDate) => setDate(newDate)} />
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Duration (min)"
                type="number"
                value={durationMin}
                onChange={(e) =>
                  setDurationMin(e.target.value === '' ? '' : Number(e.target.value))
                }
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Price (optional)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                fullWidth
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={smsReminder}
                  onChange={(e) => setSmsReminder(e.target.checked)}
                />
              }
              label="Send SMS reminder"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={disabled}
            variant="contained"
            sx={{
              backgroundColor: disabled ? 'grey.500' : 'black',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              '&.Mui-disabled': { color: 'white' },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
