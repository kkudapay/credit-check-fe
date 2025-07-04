// 메타데이터 추가 라우터

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId, metadata } = await req.json();

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: metadata,
  });

  if (error) {
    return NextResponse.json({ success: false, error });
  }

  return NextResponse.json({ success: true, data });
}
