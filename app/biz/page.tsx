// 메타데이터 설정
import { Metadata } from 'next';
import BizClient from './bizClient';

export async function generateMetadata({ searchParams }: { searchParams: { search?: string } }): Promise<Metadata> {
  const query = searchParams.search;
  const baseUrl = 'https://credit.kkuda.kr/biz';
  const fullUrl = query ? `${baseUrl}?search=${encodeURIComponent(query)}` : baseUrl;
  const title = query
    ? `${query} 조회 결과 - 꾸다 외상체크`
    : '꾸다 외상체크 - 사업자번호 조회로 연체내역 실시간 조회';

  const description = query
    ? `${query} 모르고 거래 하면 큰일! 미수금 걱정을 줄이는 필수 확인 정보.`
    : '사업자등록번호 조회로 사업자 대출·카드 연체내역을 실시간으로 조회하세요. 미수금 걱정을 줄이는 필수 확인 정보.';

  return {
    title,
    description,
    openGraph: {
      title: `[꾸다 외상체크] ${query ? `${query} 모르고 거래 하면 큰일!` : '[꾸다 외상체크] 사업자 연체내역을 실시간으로 조회하세요'}`,
      description: `${query ? `사업자 대출·카드 연체내역을 실시간으로 조회하세요.` : `미수금 걱정을 줄이는 필수 확인 정보.`}`,
      url: fullUrl,
      siteName: '꾸다 외상체크',
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: `${query ? `https://credit.kkuda.kr/image/og_image_1.png` : `https://credit.kkuda.kr/image/og_image_2.png`}`,
          width: 1200,
          height: 630,
          alt: '꾸다 외상체크 썸네일',
        },
      ],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}


export default async function BizPage({ searchParams }: { searchParams: { search?: string } }) {
  
  return (
    <BizClient 
    />
  );
}
