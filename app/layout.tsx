//전체 사이트 공통 레이아웃 파일
import './globals.css';
import { Inter } from 'next/font/google';
import { sharedMetadata } from './shared-metadata';
import GTMInitializer from '@/components/ui/GTMInitializer';
import { Toaster } from 'sonner'; // sonner 알람 사용을 위해
import paviconImage from '@/public/image/credit_kkuda_favicon.png';
import localFont from 'next/font/local';

/*
const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-pretendard',
})
*/

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
})

// GTM을 위한 값 선언
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}


//const inter = Inter({ subsets: ['latin'] });

export const metadata = sharedMetadata;





export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="ko" className={pretendard.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "꾸다 외상체크 - 사업자번호 조회로 연체내역 실시간 조회",
              "description": "사업자등록번호 조회로 사업자 대출·카드 연체내역을 실시간으로 조회하세요. 미수금 걱정을 줄이는 필수 확인 정보.",
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
      <body className={pretendard.className} >
        <Toaster position="top-center" richColors /> 
        <link rel="shortcut icon" href={paviconImage.src} />
        <GTMInitializer /> {children}</body>
    </html>
  );
}