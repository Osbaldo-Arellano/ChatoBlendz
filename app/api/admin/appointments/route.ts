import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { supabaseAdmin } from '@/lib/supabase-admin';

// ---------- helpers ----------
function timeToMinutes(t?: string): number {
  // expects "h:mm A" (e.g., "12:30 PM")
  if (!t) return -1;
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return -1;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toUpperCase();
  if (mer === 'PM' && h !== 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

// ---------- GET: list (admin only) ----------
export async function GET() {
  // optional: guard with auth if you want
  const { data, error } = await supabaseAdmin.from('appointments').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sorted = (data ?? []).sort((a: any, b: any) => {
    // sort by date then start_time (AM/PM-aware)
    const da = a.date ?? '';
    const db = b.date ?? '';
    if (da !== db) return da.localeCompare(db);
    return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
  });

  return NextResponse.json(sorted);
}

// ---------- POST: create (admin only) ----------
export async function POST(req: NextRequest) {
  // App Router: do NOT pass `req` to getSession
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Accept either admin-form field names or reference route names
  const clientName   = body.clientName ?? body.name;
  const clientPhone  = body.clientPhone ?? body.phone_number;
  const smsReminder  = body.smsReminder ?? body.sms_reminder ?? false;
  const date         = body.date;
  const startTime    = body.startTime ?? body.start_time;
  const serviceName  = body.serviceName ?? body.service_name ?? body.service;
  const price        = body.price ?? null;
  const addons       = body.addons ?? null;
  const totalPrice   = body.totalPrice ?? body.total_price ?? null;

  if (!clientName || !clientPhone || !date || !startTime || !serviceName) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 }
    );
  }

  // Conflict check: same date + start_time
  const { data: existing, error: checkError } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .eq('date', date)
    .eq('start_time', startTime);

  if (checkError) {
    return NextResponse.json({ error: 'Failed to check availability.' }, { status: 500 });
  }
  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: 'This time slot is already booked. Please select another time.' },
      { status: 409 }
    );
  }

  const record = {
    name: clientName,
    phone_number: clientPhone,
    sms_reminder: !!smsReminder,
    date,
    start_time: startTime,
    service: serviceName,
    price,
    addons: addons ? JSON.stringify(addons) : null,
    total_price: totalPrice,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert([record])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, appointment: data?.[0] });
}

// ---------- PUT: update (admin only) ----------
export async function PUT(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, addons, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'Missing required field: id.' }, { status: 400 });

  const payload = {
    ...fields,
    ...(addons !== undefined ? { addons: addons ? JSON.stringify(addons) : null } : {}),
  };

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .update(payload)
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] || {});
}

// ---------- DELETE: delete (admin only) ----------
export async function DELETE(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });

  const { error } = await supabaseAdmin.from('appointments').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: `Appointment ${id} deleted.` });
}
