import type { Metadata } from 'next';

export default function DocsHomePage() {
  return (
    <>
      <h1>Bitcoin Auth PWA Documentation</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Complete guide to Bitcoin-based authentication and component library
      </p>

      <h2>What Makes This Different?</h2>

      <h3>🔐 True Decentralization</h3>
      <p>Your identity belongs to you, not to any company or service. Built on Bitcoin's proven cryptographic foundations.</p>

      <h3>🚀 Production Ready</h3>
      <p>Over 89 components ready for production use, with comprehensive TypeScript support and modern React patterns.</p>

      <h3>🎨 Beautiful by Default</h3>
      <p>8 Bitcoin-themed color schemes with light/dark mode support and responsive design.</p>

      <h3>🔗 Multi-Profile Support</h3>
      <p>Create and manage multiple identities from a single master backup using BAP (Bitcoin Attestation Protocol).</p>

      <h2>Quick Start</h2>

      <pre><code className="language-bash">npm install bigblocks</code></pre>

      <pre><code className="language-tsx" title="app.tsx">{`import { BitcoinAuthProvider, LoginForm } from 'bigblocks';

export default function App() {
  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <LoginForm 
        mode="signin"
        onSuccess={(user) => console.log('Authenticated:', user)}
      />
    </BitcoinAuthProvider>
  );
}`}</code></pre>

      <h2>Key Features</h2>

      <ul>
        <li><strong>No Passwords</strong>: Bitcoin private keys are the only authentication method</li>
        <li><strong>OAuth Backup</strong>: Use Google/GitHub/Twitter as encrypted backup storage</li>
        <li><strong>Device Linking</strong>: QR code-based device-to-device identity transfer</li>
        <li><strong>Progressive Web App</strong>: Install on any device, works offline</li>
        <li><strong>Multi-Platform</strong>: Desktop, mobile, and web support</li>
      </ul>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">🔐 Authentication</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Learn how to implement Bitcoin-based authentication in your app
          </p>
          <a href="/docs/authentication" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            View Auth Docs →
          </a>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">👤 Profile Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Manage user profiles and identities with BAP protocol
          </p>
          <a href="/docs/profiles" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            View Profile Docs →
          </a>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">🎨 Components</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Complete reference for the bigblocks component library
          </p>
          <a href="/components" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            View Components →
          </a>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            🤖 LLMs.txt 
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">New</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Machine-readable project information for AI assistants
          </p>
          <a href="/llms.txt" target="_blank" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            View LLMs.txt →
          </a>
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Bitcoin Auth PWA Documentation',
  description: 'Complete guide to Bitcoin-based authentication and component library',
};