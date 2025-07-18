//전체 사이트 공통 레이아웃 파일
import './globals.css';
import { Inter } from 'next/font/google';
import { sharedMetadata } from './shared-metadata';
import GTMInitializer from '@/components/ui/GTMInitializer';
import { Toaster } from 'sonner'; // sonner 알람 사용을 위해
// GTM을 위한 값 선언
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}


const inter = Inter({ subsets: ['latin'] });

export const metadata = sharedMetadata;





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
              "name": "꾸다 외상체크 - 연체내역을 사업자번호로 실시간 조회하세요",
              "description": "개인사업자 사업자등록번호 조회. 사업자등록번호만 입력하고 연체내역과 신용위험도를 실시간으로 확인하세요. 안전한 거래를 위한 필수 확인 정보.",
              "url": "https://credit.kkuda.kr",
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
        <meta name="naver-site-verification" content="8fe9477cf9a986d3bcb0e6aef2c1ea9cb1b3923a" />
        <meta name="google-site-verification" content="tZl4zpaDfoMQLHloR4n4J-QWKYzF9ip8YWp1OrB8LtI" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-center" richColors /> 
        
        <GTMInitializer /> {children}</body>
    </html>
  );
}