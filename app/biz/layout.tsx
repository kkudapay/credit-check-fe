import { sharedMetadata } from '../shared-metadata';

export const metadata = sharedMetadata;

export default function BizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}