import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Biz',
  alternates: {
    canonical: 'https://credit.kkuda.kr/biz',
  },
};

export default function BizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      </>
  );
}