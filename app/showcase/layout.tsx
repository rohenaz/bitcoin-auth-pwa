import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bitcoin Auth UI - Component Showcase',
  description: 'Production-ready Bitcoin authentication components for React applications',
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}