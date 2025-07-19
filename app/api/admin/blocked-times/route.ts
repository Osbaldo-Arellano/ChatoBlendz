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
    startDate,   // required, e.g. "2025-07-10"
    startTime,   // required, e.g. "13:00"
    endTime,     // required, e.g. "14:00"
    reason       // optional
  } = body;

  if (!startDate || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const block = {
    date: startDate,
    start_time: startTime,
    end_time: endTime,
    reason,
    status: 'active',
  };

  const { data, error } = await supabaseAdmin
    .from('blocked_times')
    .insert(block)   // insert single block
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);  // return single blocked time
}

// PUT: update a blocked time (admin only)
export async function PUT(req: NextRequest) {
    // console.log(req.body);

  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, date, start_time, end_time, reason } = body;

  console.log(id, date, start_time, end_time, reason)

  if (!id || !start_time || !end_time || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('blocked_times')
    .update({
      date,         
      start_time,
      end_time,
      reason, 
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ Supabase update error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = {
    ...data[0],
    id: String(data[0].id),                         // Ensure consistent string ID
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
