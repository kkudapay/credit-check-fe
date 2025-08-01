import type { Metadata } from 'next';
/*
export const metadata: Metadata = {
  title: '꾸다 외상체크 - 사업자번호 조회로 연체내역 실시간 조회',
  description: '사업자등록번호 조회로 사업자 대출·카드 연체내역을 실시간으로 조회하세요. 미수금 걱정을 줄이는 필수 확인 정보.',
  openGraph: {
    title: '[꾸다 외상체크] 사업자 연체내역을 실시간으로 조회하세요',
    description: '미수금 걱정을 줄이는 필수 확인 정보.',
    url: 'https://credit.kkuda.kr',
    siteName: '꾸다 외상체크',
    locale: 'ko_KR',
    type: 'website',
    images: [
    {
      url: 'https://credit.kkuda.kr/image/og_image_2.png',
      width: 1200, 
      height: 630, 
      alt: '꾸다 외상체크 썸네일',
    },
  ],
  },
  alternates: {
    canonical: 'https://credit.kkuda.kr/biz',
  },
};
*/
export default function BizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      </>
  );
}