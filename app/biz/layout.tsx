import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '꾸다 외상체크',
  description: '사업자번호, 연체, 위험도 등 최신 정보 제공. 거래 시 반드시 확인하세요. 매주 업데이트되는 개인사업자 신용정보 플랫폼.',
  openGraph: {
    title: '꾸다 외상체크',
    description: '사업자번호, 연체, 위험도 등 최신 정보 제공. 거래 시 반드시 확인하세요. 매주 업데이트되는 개인사업자 신용정보 플랫폼.',
    url: 'https://kkudacheck.kr/biz',
  },
  alternates: {
    canonical: 'https://kkudacheck.kr/biz',
  },
};

export default function BizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}