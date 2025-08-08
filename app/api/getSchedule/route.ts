import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { DateTime } from 'luxon';

/**
 * Convert a time string in 24-hour format (HH:mm) to a 12-hour format (h:mm a) in PST.
 * @param timeStr - The time string in "HH:mm" format.
 * @returns A formatted time string in 12-hour format with AM/PM.
 */
function to12Hour(timeStr: string) {
  const [hours, minutes] = timeStr.split(':');

  const formatted = DateTime.fromObject(
    { hour: parseInt(hours), minute: parseInt(minutes) },
    { zone: 'America/Los_Angeles' }
  ).toFormat('h:mm a');

  return formatted;
}

/**
 * GET: Retrieve the list of booked and blocked time slots for a given date.
 * - Requires the `date` query parameter in YYYY-MM-DD format.
 * - Fetches:
 *   1. Appointments from the `appointments` table.
 *   2. Active blocked times from the `blocked_times` table.
 * - If the date is today, automatically blocks all past time slots.
 * - Returns data in 12-hour format.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  }

  const [{ data: appointments, error: apptError }, { data: blockedTimes, error: blockError }] =
    await Promise.all([
      supabaseAdmin.from('appointments').select('start_time').eq('date', date),
      supabaseAdmin.from('blocked_times').select('start_time, end_time').eq('date', date).eq('status', 'active'),
    ]);

  if (apptError || blockError) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }

  const nowPST = DateTime.now().setZone('America/Los_Angeles');
  const currentTime = nowPST.toFormat('h:mm a');
  const isToday = nowPST.toFormat('yyyy-MM-dd') === date;

  const autoBlockedTimes = isToday ? generatePastBlockedTimes(currentTime) : [];

  const appointments12h = (appointments || []).map((item) => ({
    time: item.start_time,
  }));

  const blockedTimes12h = [
    ...autoBlockedTimes,
    ...(blockedTimes || []).map((item) => ({
      start_time: to12Hour(item.start_time),
      end_time: to12Hour(item.end_time),
    })),
  ];

  return NextResponse.json({
    appointments: appointments12h,
    blockedTimes: blockedTimes12h,
  });
}

/**
 * Generate time slots that should be auto-blocked because they are in the past.
 * - Used when the requested date is today.
 * - Returns 30-minute intervals from 7:00 AM to 11:00 PM that occur before the current time.
 * @param currentTime - The current time in 12-hour format (h:mm a).
 * @returns An array of objects with start_time and end_time in 12-hour format.
 */
function generatePastBlockedTimes(currentTime: string) {
  const allTimeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '11:00 PM'
  ];

  return allTimeSlots
    .filter((slot) => {
      const slotTime = DateTime.fromFormat(slot, 'h:mm a', { zone: 'America/Los_Angeles' });
      const current = DateTime.fromFormat(currentTime, 'h:mm a', { zone: 'America/Los_Angeles' });
      return slotTime < current;
    })
    .map((slot) => {
      const start = DateTime.fromFormat(slot, 'h:mm a', { zone: 'America/Los_Angeles' });
      const end = start.plus({ minutes: 30 });
      return {
        start_time: start.toFormat('h:mm a'),
        end_time: end.toFormat('h:mm a'),
      };
    });
}
