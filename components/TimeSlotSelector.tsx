'use client';

import { Button, Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

interface AvailabilityWindow {
  start: string;
  end: string;
}

interface Availability {
  weekdays: AvailabilityWindow;
  weekends: AvailabilityWindow;
}

interface TimeSlotSelectorProps {
  timeSlots: string[];
  availability: Availability | null;
  selectedDay: Dayjs;
  blockedTimes: string[];
  selectedTime: string;                   // <--- NEW PROP
  onSelectTime: (time: string) => void;
}

export default function TimeSlotSelector({
  timeSlots,
  availability,
  selectedDay,
  blockedTimes,
  selectedTime,                           // <--- NEW PROP
  onSelectTime,
}: TimeSlotSelectorProps) {
  const isWeekend = selectedDay.day() === 0 || selectedDay.day() === 6;
  const window: AvailabilityWindow | null = availability
    ? isWeekend
      ? availability.weekends
      : availability.weekdays
    : null;

  const format = 'h:mm A';
  const base = dayjs().startOf('day');

  const normalizeTime = (time: string) => {
    const parsed = dayjs(time, format);
    return parsed.isValid() ? parsed.format(format) : time.trim().toLowerCase();
  };

  const blockedSet = new Set(blockedTimes.map(t => normalizeTime(t)));
  const normalizedSelected = normalizeTime(selectedTime);

  const slotsToRender = window
    ? timeSlots.filter(slot => {
        const pSlot = dayjs(slot, format);
        const pStart = dayjs(window.start, format);
        const pEnd = dayjs(window.end, format);

        const tSlot = base.hour(pSlot.hour()).minute(pSlot.minute());
        const tStart = base.hour(pStart.hour()).minute(pStart.minute());
        const tEnd = base.hour(pEnd.hour()).minute(pEnd.minute());

        return tSlot.isSameOrAfter(tStart) && tSlot.isSameOrBefore(tEnd);
      })
    : [];

  if (slotsToRender.length === 0) {
    return (
      <Box sx={{ width: '100%', mb: 6, textAlign: 'center', color: 'gray' }}>
        <Typography>No availability {selectedDay.format('MMMM D')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, mb: 5 }}>
      {slotsToRender.map(time => {
        const normalizedSlot = normalizeTime(time);
        const isBlocked = blockedSet.has(normalizedSlot);
        const isSelected = normalizedSlot === normalizedSelected;

        const greyedOut = isBlocked || isSelected;

        return (
          <Button
            key={time}
            disabled={isBlocked}
            onClick={() => !isBlocked && onSelectTime(time)}
            sx={{
              fontSize: '0.75rem',
              backgroundColor: greyedOut ? '#e0e0e0' : '#1a1a1a',
              color: greyedOut ? 'gray' : 'white',
              borderRadius: 2,
              px: 2,
              minWidth: '80px',
              flex: '0 0 auto',
              textTransform: 'none',
              fontWeight: 'bold',
              cursor: isBlocked ? 'not-allowed' : 'pointer',
            }}
          >
            {time}
          </Button>
        );
      })}
    </Box>
  );
}
