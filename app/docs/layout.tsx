import type { ReactNode } from 'react';
import { DocsLayout } from '../../components/docs/DocsLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}