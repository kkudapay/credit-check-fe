import type { Metadata } from 'next';

export const sharedMetadata: Metadata = {
  title: '꾸다 외상체크 - 연체내역을 사업자번호로 실시간 조회하세요',
  description: '개인사업자 사업자등록번호 조회. 사업자등록번호만 입력하고 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.',
  openGraph: {
    title: '꾸다 외상체크 - 연체내역을 사업자번호로 실시간 조회하세요',
    description: '개인사업자 사업자등록번호 조회. 사업자등록번호만 입력하고 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.',
    url: 'https://credit.kkuda.kr',
    siteName: '꾸다 외상체크',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};