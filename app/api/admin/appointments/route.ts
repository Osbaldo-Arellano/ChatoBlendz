import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all appointments (admin only)
export async function GET() {
  const { data, error } = await supabaseAdmin.from('appointments').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
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

  return NextResponse.json(data[0]);
}

// PUT: update appointment (admin only)
export async function PUT(req: NextRequest) {
  const session = await auth0.getSession(req);
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

  return NextResponse.json(data[0]);
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
