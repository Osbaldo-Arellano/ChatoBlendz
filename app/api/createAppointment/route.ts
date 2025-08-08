import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST: create a new appointment
export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    clientName,
    clientPhone,
    smsReminder,
    date,
    startTime,
    serviceName,
    price,
    addons,
    totalPrice,
  } = body;

  if (!clientName || !clientPhone || !date || !startTime || !serviceName) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 }
    );
  }

  // Check if time slot is already booked
  const { data: existingAppointments, error: checkError } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .eq('date', date)
    .eq('start_time', startTime);

  if (checkError) {
    return NextResponse.json({ error: 'Failed to check availability.' }, { status: 500 });
  }

  if (existingAppointments && existingAppointments.length > 0) {
    return NextResponse.json(
      { error: 'This time slot is already booked. Please select another time.' },
      { status: 409 } // Conflict
    );
  }

  const appointment = {
    name: clientName,
    phone_number: clientPhone,
    sms_reminder: smsReminder ?? false,
    date,
    start_time: startTime,
    service: serviceName,
    price,
    addons: addons ? JSON.stringify(addons) : null, 
    total_price: totalPrice,
    created_at: new Date().toISOString(),
  };

  // Save to Supabase
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert([appointment])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, appointment: data?.[0] });
}
