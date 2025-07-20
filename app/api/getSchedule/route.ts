import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { DateTime } from 'luxon';

function to12Hour(timeStr: string) {
  // Ensure timeStr is in 'HH:MM:SS' format; parse accordingly
  const [hours, minutes] = timeStr.split(':');
  return new Date(`1970-01-01T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles', // Force PST
  });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    console.warn('⚠️ Missing date in query params');
    return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  }

  const [{ data: appointments, error: apptError }, { data: blockedTimes, error: blockError }] =
    await Promise.all([
      supabaseAdmin.from('appointments').select('start_time').eq('date', date),
      supabaseAdmin
        .from('blocked_times')
        .select('start_time, end_time')
        .eq('date', date)
        .eq('status', 'active'),
    ]);

  if (apptError || blockError) {
    console.error('❌ Supabase fetch error:', { apptError, blockError });
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }

  const nowPST = DateTime.now().setZone('America/Los_Angeles');
  const isToday = nowPST.toFormat('yyyy-MM-dd') === date;

  const currentTime = nowPST.toFormat('h:mm a');

  const autoBlockedTimes = isToday ? generatePastBlockedTimes(currentTime) : [];

  const appointments12h = (appointments || []).map((item) => ({
    time: item.start_time,  // Already in 12-hour format
  }));

  const blockedTimes12h = [
    ...autoBlockedTimes,
    ...(blockedTimes || []).map((item) => ({
      start_time: to12Hour(item.start_time),
      end_time: to12Hour(item.end_time),
    })),
  ];

  console.log(blockedTimes12h);

  return NextResponse.json({
    appointments: appointments12h,
    blockedTimes: blockedTimes12h,
  });
}

function generatePastBlockedTimes(currentTime: string) {
  const allTimeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM'
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
