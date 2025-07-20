// app/api/bookings/route.ts

import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { startIso, endIso, serviceName, servicePrice, addons, clientInfo } = body as {
      startIso: string;
      endIso: string;
      serviceName: string;
      servicePrice: number;
      addons: { name: string; price: number }[];
      clientInfo: { name: string; phone: string; smsReminder: boolean };
    };

    const start = dayjs(startIso).toISOString();
    const end = dayjs(endIso).toISOString();

    const { data: conflicts, error: conflictError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .gt('start_time', dayjs(end).subtract(1, 'second').toISOString())
      .lt('end_time', dayjs(start).add(1, 'second').toISOString())
      .limit(1);

    if (conflictError) throw conflictError;
    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'That time slot was just taken. Please pick another.' },
        { status: 409 },
      );
    }

    const { data, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert({
        start_time: start,
        end_time: end,
        service_name: serviceName,
        service_price: servicePrice,
        addons,
        client_name: clientInfo.name,
        client_phone: clientInfo.phone,
        sms_reminder: clientInfo.smsReminder,
      })
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ booking: data }, { status: 201 });
  } catch (err: any) {
    console.error('Booking API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
