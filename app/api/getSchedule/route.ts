import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function to12Hour(timeStr: string) {
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
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
      supabase.from('appointments').select('time').eq('date', date),
      supabase
        .from('blocked_times')
        .select('start_time, end_time')
        .eq('date', date)
        .eq('status', 'active'),
    ]);

  if (apptError || blockError) {
    console.error('❌ Supabase fetch error:', { apptError, blockError });
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }

  const appointments12h = (appointments || []).map((item) => ({
    time: to12Hour(item.time),
  }));

  const blockedTimes12h = (blockedTimes || []).map((item) => ({
    start_time: to12Hour(item.start_time),
    end_time: to12Hour(item.end_time),
  }));

  return NextResponse.json({
    appointments: appointments12h,
    blockedTimes: blockedTimes12h,
  });
}
