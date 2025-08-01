import { Toaster } from 'sonner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그 - 꾸다 외상체크',
    description: '사업자등록번호 조회로 사업자 대출·카드 연체내역을 실시간으로 조회하세요. 미수금 걱정을 줄이는 필수 확인 정보.',
    openGraph: {
      title: '꾸다 외상체크 블로그',
      description: '사장님의 걱정을 줄이는 정보를 확인하세요.',
      url: 'https://credit.kkuda.kr/blog',
    },
    alternates: {
      canonical: 'https://credit.kkuda.kr/blog',
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      {children}
    </>
  );
}