import { sharedMetadata } from '../shared-metadata';

import '../globals.css';
import { Toaster } from 'sonner'; // sonner 알람 사용을 위해

export const metadata = sharedMetadata;

export default function BizLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Toaster position="top-center" richColors /> 
        {children}
      </body>
    </html>
  );
}