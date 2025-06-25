//전체 사이트 공통 레이아웃 파일
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '꾸다 외상체크 - 사업자번호 연체정보 실시간 조회',
  description: '사업자번호로 연체정보, 신용위험도를 실시간 확인하세요. 거래 전 필수 체크! 매주 업데이트되는 신용정보 플랫폼.',
  keywords: '사업자번호, 연체정보, 신용조회, 외상체크, 사업자조회, 신용위험',
  openGraph: {
    title: '꾸다 외상체크 - 사업자번호 연체정보 실시간 조회',
    description: '사업자번호로 연체정보, 신용위험도를 실시간 확인하세요.',
    url: 'https://kkudacheck.kr',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "꾸다 외상체크",
              "description": "사업자번호 연체정보 실시간 조회 서비스",
              "url": "https://kkudacheck.kr",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}