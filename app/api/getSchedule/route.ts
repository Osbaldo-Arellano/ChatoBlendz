import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

  // Fetch start_time from appointments table (your new schema)
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

  // Each appointment blocks exactly 1 hour
  const appointments12h = (appointments || []).map((item) => ({
    time: item.start_time,
  }))

  const blockedTimes12h = (blockedTimes || []).map((item) => ({
    start_time: item.start_time,
    end_time: item.end_time,
  }));

  return NextResponse.json({
    appointments: appointments12h,
    blockedTimes: blockedTimes12h,
  });
}
