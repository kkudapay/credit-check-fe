//홈 경로 처리 파일 (-> /biz 로 리다이렉트)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /biz as the main search page
    router.replace('/biz');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">페이지를 불러오는 중...</p>
      </div>
    </div>
  );
}