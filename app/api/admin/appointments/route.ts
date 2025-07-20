import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all appointments (admin only)
export async function GET() {
  const { data, error } = await supabaseAdmin.from('appointments').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sortedData = (data ?? []).sort((a, b) => {
    const [aHour, aMin] = a.start_time?.split(':').map(Number) || [0, 0];
    const [bHour, bMin] = b.start_time?.split(':').map(Number) || [0, 0];
    return aHour !== bHour ? aHour - bHour : aMin - bMin;
  });

  return NextResponse.json(sortedData);
}

// POST: create a new appointment (admin only)
export async function POST(req: NextRequest) {
  const session = await auth0.getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    date,
    service,
    phone_number,
    price,
    addons,
    service_name,
    total_price,
    sms_reminder,
    start_time,
  } = body;

  if (!name || !date || !start_time) {
    return NextResponse.json(
      { error: 'Missing required fields: name, date, and start_time are required.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert([
      {
        name,
        date,
        service,
        phone_number,
        price,
        addons,
        service_name,
        total_price,
        sms_reminder: sms_reminder?.toString() ?? 'false',
        start_time,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0] || {});
}

// PUT: update appointment (admin only)
export async function PUT(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required field: id.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .update(fields)
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0] || {});
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

  const { error } = await supabaseAdmin.from('appointments').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Appointment ${id} deleted.` });
}
