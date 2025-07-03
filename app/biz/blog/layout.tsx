import { Toaster } from 'sonner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '꾸다 외상체크 - 연체내역을 사업자번호로 실시간 조회하세요',
    description: '개인사업자 사업자등록번호 조회. 사업자등록번호만 입력하고 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.',
    openGraph: {
      title: '꾸다 외상체크 - 연체내역을 사업자번호로 실시간 조회하세요',
      description: '개인사업자 사업자등록번호 조회. 사업자등록번호만 입력하고 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.',
      url: 'https://kkudacheck.kr/biz/blog',
    },
    alternates: {
      canonical: 'https://kkudacheck.kr/biz/blog',
    },
};

export default function BizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      {children}
    </>
  );
}