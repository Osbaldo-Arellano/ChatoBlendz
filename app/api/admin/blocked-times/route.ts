import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { formatTimeTo12Hour } from '@/lib/formatTime';

// GET all blocked times (admin only)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('blocked_times')
    .select('*')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true});

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = (data ?? []).map((block) => ({
    ...block,
    start_time: formatTimeTo12Hour(block.start_time),
    end_time: formatTimeTo12Hour(block.end_time),
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    repeatDays,   // e.g., [0, 2, 4]
    startTime,    // "09:00"
    endTime,      // "17:00"
    reason,       // optional
    startDate     // new: "2025-07-10"
  } = body;

  if (!repeatDays || !Array.isArray(repeatDays) || repeatDays.length === 0 || !startTime || !endTime || !startDate) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const anchor = new Date(startDate);
  anchor.setHours(0, 0, 0, 0);

  const blocks: any[] = [];

  for (const dayOffset of repeatDays) {
    const targetDate = new Date(anchor);
    targetDate.setDate(anchor.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    blocks.push({
      date: dateStr,
      start_time: startTime,
      end_time: endTime,
      reason,
      status: 'active',
    });
  }

  const { data, error } = await supabaseAdmin
    .from('blocked_times')
    .insert(blocks)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT: update a blocked time (admin only)
export async function PUT(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }



  const body = await req.json();
  const { id, date, start_time, end_time, reason } = body;
  if (!id || !start_time || !end_time || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('blocked_times')
    .update({ start_time, end_time, reason })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = {
    ...data[0],
    start_time: formatTimeTo12Hour(data[0].start_time),
    end_time: formatTimeTo12Hour(data[0].end_time),
  };

  return NextResponse.json(formatted);
}

// DELETE: remove a single blocked time by ID (admin only)
export async function DELETE(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing block ID' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('blocked_times')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Blocked time ${id} deleted.` });
}
