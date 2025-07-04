// 메타데이터 추가 페이지 (테스트)
'use client'

import { useEffect } from 'react';

export default function TestMetadataUpdatePage() {
  useEffect(() => {
    const update = async () => {
      const res = await fetch('/api/update-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '5c569b54-2d84-4494-b4c5-0807b37cb0f2',
          metadata: { role: 'admin' },
        }),
      });

      const result = await res.json();
      console.log('메타데이터 업데이트 결과:', result);
    };

    update();
  }, []);

  return <div className="p-10 text-xl">업데이트 중... 콘솔을 확인하세요.</div>;
}
