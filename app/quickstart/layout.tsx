import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Start - BigBlocks.dev',
  description: 'Get started quickly with Bitcoin development - live examples and working code',
};

export default function QuickStartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}