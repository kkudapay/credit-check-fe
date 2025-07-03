import { sharedMetadata } from '@/app/shared-metadata';

export const metadata = sharedMetadata;

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}