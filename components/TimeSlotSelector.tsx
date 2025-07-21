import { Button, Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Lottie from 'lottie-react';
import loadingAnimation from "@/lottiefiles/cat Mark loading.json";

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
  selectedTime: string;
  onSelectTime: (time: string) => void;
  isLoading?: boolean;
}

export default function TimeSlotSelector({
  timeSlots,
  availability,
  selectedDay,
  blockedTimes,
  selectedTime,
  onSelectTime,
  isLoading = false,
}: TimeSlotSelectorProps) {
  const isWeekend = selectedDay.day() === 0 || selectedDay.day() === 6;
  const windowRange: AvailabilityWindow | null = availability
    ? isWeekend
      ? availability.weekends
      : availability.weekdays
    : null;

  const FORMAT = 'h:mm A';
  const startOfDay = dayjs().startOf('day');

  const normalizeTime = (t: string) => {
    const parsed = dayjs(t, FORMAT);
    return parsed.isValid() ? parsed.format(FORMAT) : t.trim().toLowerCase();
  };

  const blockedSet = new Set(blockedTimes.map(normalizeTime));
  const normalizedSelected = normalizeTime(selectedTime);

  const inWindow = windowRange
    ? timeSlots.filter((slot) => {
      const pSlot = dayjs(slot, FORMAT);
      const pStart = dayjs(windowRange.start, FORMAT);
      const pEnd = dayjs(windowRange.end, FORMAT);

      const tSlot = startOfDay.hour(pSlot.hour()).minute(pSlot.minute());
      const tStart = startOfDay.hour(pStart.hour()).minute(pStart.minute());
      const tEnd = startOfDay.hour(pEnd.hour()).minute(pEnd.minute());

      return tSlot.isSameOrAfter(tStart) && tSlot.isSameOrBefore(tEnd);
    })
    : [];

  const slotsToRender = inWindow.filter((slot) => !blockedSet.has(normalizeTime(slot)));

  return (
    <Box
      sx={{
        backgroundColor: '#fafafa',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        minHeight: '25vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isLoading ? 'center' : 'flex-start',
        alignItems: 'center',
        padding: 2,
        mb: 4,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#333',
          letterSpacing: '0.02em',
          mb: isLoading ? 0 : 1,
        }}
      >
        Select a Time Slot
      </Typography>

      {isLoading ? (
        <Box sx={{ py: 2 }}>
          <Lottie
            animationData={loadingAnimation}
            loop
            style={{ height: 100, width: 100, background: 'transparent' }}
          />
        </Box>
      ) : slotsToRender.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#999', mt: 2 }}>
          No availability {selectedDay.format('MMMM D')}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
            gap: 1,
            mt: 1,
            width: '100%',
            paddingY: 1,
          }}
        >
          {slotsToRender.map((time) => {
            const normalizedSlot = normalizeTime(time);
            const isSelected = normalizedSlot === normalizedSelected;

            return (
              <Button
                key={time}
                onClick={() => onSelectTime(time)}
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: '10px',
                  px: 1,
                  py: 1.5,
                  textTransform: 'none',
                  backgroundColor: isSelected ? '#000' : '#f5f5f5',
                  color: isSelected ? '#fff' : '#333',
                  border: isSelected ? '1px solid #000' : '1px solid #ddd',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                  '&:hover': {
                    backgroundColor: isSelected ? '#000' : '#e0e0e0',
                  },
                  transition: 'all 0.2s',
                  width: '100%',
                }}
                disableRipple
                disableTouchRipple
              >
                {time}
              </Button>
            );
          })}
        </Box>
      )}

      {!isLoading && slotsToRender.length > 0 && (
        <Typography
          variant="caption"
          sx={{
            color: '#888',
            fontSize: '0.7rem',
            mt: 1,
          }}
        >
          Times are in Pacific Time (PST)
        </Typography>
      )}
    </Box>

  );
}
