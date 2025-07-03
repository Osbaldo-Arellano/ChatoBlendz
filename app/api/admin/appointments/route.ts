import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { supabaseAdmin } from '@/lib/supabase-admin';

export function formatTimeTo12Hour(time: string): string {
  if (!time) return time;
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// GET all appointments (admin only)
export async function GET() {
  const { data, error } = await supabaseAdmin.from('appointments').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sortedData = (data ?? []).sort((a, b) => {
    const [aHour, aMin] = a.time.split(':').map(Number);
    const [bHour, bMin] = b.time.split(':').map(Number);
    return aHour !== bHour ? aHour - bHour : aMin - bMin;
  });

  const formattedData = sortedData.map((appointment) => ({
    ...appointment,
    time: formatTimeTo12Hour(appointment.time),
  }));

  return NextResponse.json(formattedData);
}


// POST: create a new appointment (admin only)
export async function POST(req: NextRequest) {
  const session = await auth0.getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, date, time, service, phone_number } = body;

  if (!name || !date || !time) {
    return NextResponse.json(
      { error: 'Missing required fields: name, date, and time are required.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert([{ name, date, time, service, phone_number }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...data[0],
    time: formatTimeTo12Hour(data[0].time),
  });
}

// PUT: update appointment (admin only)
export async function PUT(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, name, date, time, service, phone_number } = body;

  if (!id || !name || !date || !time) {
    return NextResponse.json(
      { error: 'Missing required fields: id, name, date, and time are required.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .update({ name, date, time, service, phone_number })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...data[0],
    time: formatTimeTo12Hour(data[0].time),
  });
}

// DELETE: delete appointment (admin only)
export async function DELETE(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Appointment ${id} deleted.` });
}
