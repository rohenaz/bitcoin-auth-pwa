'use client';

import dynamicImport from 'next/dynamic';

// Dynamic import with SSR disabled to prevent window access during build
const ComponentsPageClient = dynamicImport(
  () => import('@/components/ComponentsPageClient').then(mod => ({ default: mod.ComponentsPageClient })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading components...</p>
        </div>
      </div>
    )
  }
);

// Disable static generation
export const dynamic = 'force-dynamic';

export default function ComponentsPage() {
  return <ComponentsPageClient />;
}