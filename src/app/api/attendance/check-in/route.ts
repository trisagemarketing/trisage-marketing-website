import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

// Reverse Geocode GPS coordinates with Ultra-Fast 600ms Timeout Guard
async function getAddressFromCoords(lat: number, lng: number): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`,
      {
        headers: { 'User-Agent': 'TrisageEMS/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      if (addr) {
        const parts = [
          addr.suburb || addr.neighbourhood || addr.road,
          addr.city || addr.town || addr.village || addr.county,
          addr.state,
          addr.country,
        ].filter(Boolean);
        if (parts.length > 0) return parts.join(', ');
      }
      if (data.display_name) return data.display_name;
    }
  } catch (e) {
    clearTimeout(timeoutId);
  }
  return null;
}

// Fallback: IP Geolocation Lookup with Ultra-Fast 500ms Timeout
async function getAddressFromIP(ip: string): Promise<string | null> {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'Local Network (Dev)';
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 500);

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return `${data.city || ''}, ${data.regionName || ''}, ${data.country || ''}`.replace(/^,\s*|,\s*$/g, '');
      }
    }
  } catch (e) {
    clearTimeout(timeoutId);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const body = await req.json().catch(() => ({}));
  
  const latitude = body.latitude || body.lat || body.location?.lat;
  const longitude = body.longitude || body.lng || body.location?.lng;
  const notes = body.notes;

  // Extract Client IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  // Calculate local date string in Asia/Kolkata timezone (prevents UTC midnight shift bug)
  const nowInIndia = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = nowInIndia.getFullYear();
  const month = String(nowInIndia.getMonth() + 1).padStart(2, '0');
  const day = String(nowInIndia.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // 1. Check if an attendance record already exists for today
  const { data: existingRecord } = await supabase
    .from('attendance_records')
    .select('id, check_in_time, check_out_time, status')
    .eq('user_id', user.id)
    .eq('work_date', todayStr)
    .maybeSingle();

  if (existingRecord) {
    return NextResponse.json(
      {
        success: false,
        error: 'You have already checked in for today',
        record: existingRecord,
      },
      { status: 409 }
    );
  }

  // 2. Resolve Human-Readable Location Address & IP Info (Protected by Timeout Controllers)
  let resolvedAddress: string | null = null;

  if (latitude && longitude) {
    resolvedAddress = await getAddressFromCoords(Number(latitude), Number(longitude));
  }

  if (!resolvedAddress) {
    resolvedAddress = await getAddressFromIP(clientIp);
  }

  if (!resolvedAddress) {
    resolvedAddress = latitude && longitude ? `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}` : 'Office / Remote Web';
  }

  const locationJson = {
    lat: latitude ? Number(latitude) : null,
    lng: longitude ? Number(longitude) : null,
    ip: clientIp,
    address: resolvedAddress,
    timestamp: new Date().toISOString(),
  };

  // 3. Create Check-In Record in Supabase (Concurrency & Unique Constraint Guard)
  const { data: newRecord, error } = await supabase
    .from('attendance_records')
    .insert({
      user_id: user.id,
      work_date: todayStr,
      check_in_time: new Date().toISOString(),
      status: 'present',
      location_check_in: locationJson,
      notes: notes || null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Check-in insert error:', error);

    // Murphy's Law Race Condition Handling: Postgres Unique Constraint Violation (Code 23505)
    if (error.code === '23505' || error.message?.includes('duplicate key')) {
      const { data: raceRecord } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('work_date', todayStr)
        .maybeSingle();

      return NextResponse.json(
        {
          success: false,
          error: 'You have already checked in for today',
          record: raceRecord,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Checked in successfully with IP & location address tracking',
    record: newRecord,
  });
}
