export interface ComponentExample {
  id: string;
  name: string;
  description: string;
  category: string;
  importStatement: string;
  codeExample: string;
  props?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  variations?: Array<{
    name: string;
    props: Record<string, unknown>;
  }>;
}

export const componentCategories = [
  {
    id: 'auth-flows',
    name: 'Authentication Flows',
    icon: 'Workflow',
    description: 'Complete authentication user journeys'
  },
  {
    id: 'core',
    name: 'Core Components',
    icon: 'Package',
    description: 'Essential building blocks'
  },
  {
    id: 'oauth-wallets',
    name: 'OAuth & Wallets',
    icon: 'Wallet',
    description: 'Third-party integrations'
  },
  {
    id: 'device-backup',
    name: 'Device & Backup',
    icon: 'Shield',
    description: 'Security and backup features'
  },
  {
    id: 'ui-primitives',
    name: 'UI Primitives',
    icon: 'Layers',
    description: 'Basic UI components'
  },
  {
    id: 'layouts',
    name: 'Layout Components',
    icon: 'Layout',
    description: 'Page structure components'
  },
  {
    id: 'hooks',
    name: 'Hooks & Utilities',
    icon: 'Code2',
    description: 'React hooks and utilities'
  }
];

export const components: ComponentExample[] = [
  // Authentication Flows
  {
    id: 'auth-flow-orchestrator',
    name: 'AuthFlowOrchestrator',
    description: 'Smart authentication flow manager that handles signup, signin, and recovery',
    category: 'auth-flows',
    importStatement: "import { AuthFlowOrchestrator } from 'bitcoin-auth-ui';",
    codeExample: `<AuthFlowOrchestrator
  flowType="unified"
  enableOAuth={true}
  enableDeviceLink={true}
  onSuccess={(user) => console.log('Authenticated:', user)}
/>`,
    props: [
      { name: 'flowType', type: "'unified' | 'signin' | 'signup' | 'oauth-restore' | 'import' | 'device-link'", required: true, description: 'Type of authentication flow' },
      { name: 'enableOAuth', type: 'boolean', required: false, description: 'Enable OAuth provider options' },
      { name: 'enableDeviceLink', type: 'boolean', required: false, description: 'Enable device linking' },
      { name: 'enableFileImport', type: 'boolean', required: false, description: 'Enable file import option' },
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: true, description: 'Callback on successful authentication' },
      { name: 'onError', type: '(error: AuthError) => void', required: false, description: 'Error callback' }
    ],
    variations: [
      { name: 'Unified Flow', props: { flowType: 'unified' } },
      { name: 'Sign In Only', props: { flowType: 'signin' } },
      { name: 'Sign Up Only', props: { flowType: 'signup' } },
      { name: 'OAuth Restore', props: { flowType: 'oauth-restore' } }
    ]
  },
  {
    id: 'signup-flow',
    name: 'SignupFlow',
    description: 'Multi-step signup process with identity generation',
    category: 'auth-flows',
    importStatement: "import { SignupFlow } from 'bitcoin-auth-ui';",
    codeExample: `<SignupFlow
  onSuccess={(user) => console.log('Signup complete:', user)}
  onCancel={() => console.log('Signup cancelled')}
/>`,
    props: [
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: true, description: 'Callback on successful signup' },
      { name: 'onCancel', type: '() => void', required: false, description: 'Callback when user cancels' },
      { name: 'enableOAuth', type: 'boolean', required: false, description: 'Show OAuth options after signup' }
    ]
  },
  {
    id: 'oauth-restore-flow',
    name: 'OAuthRestoreFlow',
    description: 'Complete OAuth backup restoration with password decryption',
    category: 'auth-flows',
    importStatement: "import { OAuthRestoreFlow } from 'bitcoin-auth-ui';",
    codeExample: `<OAuthRestoreFlow
  provider="google"
  onSuccess={(user) => console.log('Restored:', user)}
  onCancel={() => console.log('Cancelled')}
/>`,
    props: [
      { name: 'provider', type: 'string', required: false, description: 'OAuth provider to restore from' },
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: true, description: 'Callback on successful restore' },
      { name: 'onCancel', type: '() => void', required: false, description: 'Callback when cancelled' }
    ]
  },

  // Core Components
  {
    id: 'auth-button',
    name: 'AuthButton',
    description: 'Drop-in authentication button that handles the complete flow',
    category: 'core',
    importStatement: "import { AuthButton } from 'bitcoin-auth-ui';",
    codeExample: `<AuthButton>
  Sign In with Bitcoin
</AuthButton>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Button content' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: false, description: 'Success callback' }
    ],
    variations: [
      { name: 'Default', props: { children: 'Sign In with Bitcoin' } },
      { name: 'Custom Text', props: { children: 'Connect Wallet' } },
      { name: 'With Icon', props: { children: '🔐 Authenticate' } }
    ]
  },
  {
    id: 'login-form',
    name: 'LoginForm',
    description: 'Basic login form with password input',
    category: 'core',
    importStatement: "import { LoginForm } from 'bitcoin-auth-ui';",
    codeExample: `<LoginForm
  mode="signin"
  onSuccess={(user) => console.log('Success:', user)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'mode', type: "'signin' | 'signup'", required: true, description: 'Form mode' },
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: true, description: 'Success callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'enhanced-login-form',
    name: 'EnhancedLoginForm',
    description: 'Advanced login form with multiple authentication options',
    category: 'core',
    importStatement: "import { EnhancedLoginForm } from 'bitcoin-auth-ui';",
    codeExample: `<EnhancedLoginForm
  showOAuth={true}
  showFileImport={true}
  onSuccess={(user) => console.log('Success:', user)}
/>`,
    props: [
      { name: 'showOAuth', type: 'boolean', required: false, description: 'Show OAuth options' },
      { name: 'showFileImport', type: 'boolean', required: false, description: 'Show file import option' },
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: true, description: 'Success callback' }
    ]
  },

  // OAuth & Wallets
  {
    id: 'oauth-providers',
    name: 'OAuthProviders',
    description: 'OAuth provider selection with loading and linked states',
    category: 'oauth-wallets',
    importStatement: "import { OAuthProviders } from 'bitcoin-auth-ui';",
    codeExample: `<OAuthProviders
  onProviderClick={(provider) => console.log('Selected:', provider)}
  connectedProviders={['google']}
  loadingProvider="github"
/>`,
    props: [
      { name: 'onProviderClick', type: '(provider: string) => void', required: true, description: 'Provider click handler' },
      { name: 'connectedProviders', type: 'string[]', required: false, description: 'List of connected providers' },
      { name: 'loadingProvider', type: 'string', required: false, description: 'Provider currently loading' }
    ]
  },
  {
    id: 'handcash-connector',
    name: 'HandCashConnector',
    description: 'HandCash wallet OAuth integration',
    category: 'oauth-wallets',
    importStatement: "import { HandCashConnector } from 'bitcoin-auth-ui';",
    codeExample: `<HandCashConnector
  config={{
    appId: "your-app-id",
    appSecret: "your-app-secret",
    redirectUrl: "/auth/handcash",
    environment: "prod"
  }}
  onSuccess={(result) => console.log('Connected:', result)}
/>`,
    props: [
      { name: 'config', type: 'HandCashConfig', required: true, description: 'HandCash app configuration' },
      { name: 'onSuccess', type: '(result: HandCashResult) => void', required: true, description: 'Success callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'yours-wallet-connector',
    name: 'YoursWalletConnector',
    description: 'Yours Wallet browser extension integration',
    category: 'oauth-wallets',
    importStatement: "import { YoursWalletConnector } from 'bitcoin-auth-ui';",
    codeExample: `<YoursWalletConnector
  onSuccess={(result) => console.log('Connected:', result)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'onSuccess', type: '(result: YoursWalletResult) => void', required: true, description: 'Success callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'oauth-conflict-modal',
    name: 'OAuthConflictModal',
    description: 'Modal for resolving OAuth account conflicts',
    category: 'oauth-wallets',
    importStatement: "import { OAuthConflictModal } from 'bitcoin-auth-ui';",
    codeExample: `<OAuthConflictModal
  isOpen={true}
  provider="google"
  existingBapId="existing-id-123"
  onTransferComplete={() => console.log('Transferred')}
  onSwitchAccount={() => console.log('Switched')}
  onClose={() => setOpen(false)}
/>`,
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Modal open state' },
      { name: 'provider', type: 'string', required: true, description: 'OAuth provider name' },
      { name: 'existingBapId', type: 'string', required: true, description: 'Existing account ID' },
      { name: 'onTransferComplete', type: '() => void', required: true, description: 'Transfer completion callback' },
      { name: 'onSwitchAccount', type: '() => void', required: true, description: 'Switch account callback' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close modal callback' }
    ]
  },

  // Device & Backup
  {
    id: 'device-link-qr',
    name: 'DeviceLinkQR',
    description: 'QR code generator for device-to-device linking',
    category: 'device-backup',
    importStatement: "import { DeviceLinkQR } from 'bitcoin-auth-ui';",
    codeExample: `<DeviceLinkQR
  onGenerateQR={async () => {
    const res = await fetch('/api/device-link');
    return res.json();
  }}
  baseUrl="https://example.com"
/>`,
    props: [
      { name: 'onGenerateQR', type: '() => Promise<QRData>', required: true, description: 'QR generation function' },
      { name: 'baseUrl', type: 'string', required: true, description: 'Base URL for QR links' }
    ]
  },
  {
    id: 'member-export',
    name: 'MemberExport',
    description: 'Export member profiles with QR codes',
    category: 'device-backup',
    importStatement: "import { MemberExport } from 'bitcoin-auth-ui';",
    codeExample: `<MemberExport
  profileName="My Profile"
  onGenerateExport={async () => {
    const res = await fetch('/api/member-export');
    return res.json();
  }}
  baseUrl="https://example.com"
/>`,
    props: [
      { name: 'profileName', type: 'string', required: true, description: 'Name of profile to export' },
      { name: 'onGenerateExport', type: '() => Promise<ExportData>', required: true, description: 'Export generation function' },
      { name: 'baseUrl', type: 'string', required: true, description: 'Base URL for export links' }
    ]
  },
  {
    id: 'file-import',
    name: 'FileImport',
    description: 'Drag & drop file import with validation',
    category: 'device-backup',
    importStatement: "import { FileImport } from 'bitcoin-auth-ui';",
    codeExample: `<FileImport
  onFileValidated={(file, result) => {
    console.log('Valid backup:', result.type);
  }}
  onError={(error) => console.error(error)}
/>`,
    props: [
      { name: 'onFileValidated', type: '(file: File, result: ValidationResult) => void', required: true, description: 'File validation callback' },
      { name: 'onError', type: '(error: string) => void', required: true, description: 'Error callback' }
    ]
  },
  {
    id: 'backup-download',
    name: 'BackupDownload',
    description: 'Download encrypted backup files',
    category: 'device-backup',
    importStatement: "import { BackupDownload } from 'bitcoin-auth-ui';",
    codeExample: `<BackupDownload
  backup={encryptedBackupData}
  onDownloadComplete={() => console.log('Downloaded')}
  onSkip={() => console.log('Skipped')}
/>`,
    props: [
      { name: 'backup', type: 'string', required: true, description: 'Encrypted backup data' },
      { name: 'onDownloadComplete', type: '() => void', required: true, description: 'Download completion callback' },
      { name: 'onSkip', type: '() => void', required: false, description: 'Skip callback' }
    ]
  },
  {
    id: 'mnemonic-display',
    name: 'MnemonicDisplay',
    description: 'Display recovery phrase with acknowledgment',
    category: 'device-backup',
    importStatement: "import { MnemonicDisplay } from 'bitcoin-auth-ui';",
    codeExample: `<MnemonicDisplay
  mnemonic="word1 word2 word3..."
  onAcknowledge={() => console.log('Acknowledged')}
/>`,
    props: [
      { name: 'mnemonic', type: 'string', required: true, description: 'Recovery phrase words' },
      { name: 'onAcknowledge', type: '() => void', required: true, description: 'Acknowledgment callback' }
    ]
  },
  {
    id: 'identity-generation',
    name: 'IdentityGeneration',
    description: 'Generate new Bitcoin identities',
    category: 'device-backup',
    importStatement: "import { IdentityGeneration } from 'bitcoin-auth-ui';",
    codeExample: `<IdentityGeneration
  onIdentityGenerated={(identity) => {
    console.log('New identity:', identity);
  }}
/>`,
    props: [
      { name: 'onIdentityGenerated', type: '(identity: Identity) => void', required: true, description: 'Identity generation callback' }
    ]
  },

  // UI Primitives
  {
    id: 'loading-button',
    name: 'LoadingButton',
    description: 'Button with loading states',
    category: 'ui-primitives',
    importStatement: "import { LoadingButton } from 'bitcoin-auth-ui';",
    codeExample: `<LoadingButton
  loading={isLoading}
  onClick={handleClick}
>
  Submit
</LoadingButton>`,
    props: [
      { name: 'loading', type: 'boolean', required: false, description: 'Loading state' },
      { name: 'onClick', type: '() => void', required: false, description: 'Click handler' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Button content' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state' }
    ],
    variations: [
      { name: 'Default', props: { children: 'Submit' } },
      { name: 'Loading', props: { loading: true, children: 'Processing...' } },
      { name: 'Disabled', props: { disabled: true, children: 'Disabled' } }
    ]
  },
  {
    id: 'password-input',
    name: 'PasswordInput',
    description: 'Password input with visibility toggle',
    category: 'ui-primitives',
    importStatement: "import { PasswordInput } from 'bitcoin-auth-ui';",
    codeExample: `<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter password"
/>`,
    props: [
      { name: 'value', type: 'string', required: true, description: 'Input value' },
      { name: 'onChange', type: '(e: ChangeEvent) => void', required: true, description: 'Change handler' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'error', type: 'string', required: false, description: 'Error message' }
    ]
  },
  {
    id: 'step-indicator',
    name: 'StepIndicator',
    description: 'Multi-step progress indicator',
    category: 'ui-primitives',
    importStatement: "import { StepIndicator } from 'bitcoin-auth-ui';",
    codeExample: `<StepIndicator
  steps={[
    { id: '1', label: 'Generate', status: 'complete' },
    { id: '2', label: 'Password', status: 'active' },
    { id: '3', label: 'Backup', status: 'pending' }
  ]}
/>`,
    props: [
      { name: 'steps', type: 'Step[]', required: true, description: 'Array of step objects' }
    ]
  },
  {
    id: 'modal',
    name: 'Modal',
    description: 'Reusable modal dialog',
    category: 'ui-primitives',
    importStatement: "import { Modal } from 'bitcoin-auth-ui';",
    codeExample: `<Modal
  isOpen={isOpen}
  onClose={() => setOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
</Modal>`,
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Modal open state' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
      { name: 'title', type: 'string', required: false, description: 'Modal title' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Modal content' }
    ]
  },
  {
    id: 'error-display',
    name: 'ErrorDisplay',
    description: 'Consistent error message display',
    category: 'ui-primitives',
    importStatement: "import { ErrorDisplay } from 'bitcoin-auth-ui';",
    codeExample: `<ErrorDisplay
  error="Invalid password"
  onRetry={() => console.log('Retry')}
/>`,
    props: [
      { name: 'error', type: 'string | Error', required: true, description: 'Error to display' },
      { name: 'onRetry', type: '() => void', required: false, description: 'Retry callback' }
    ]
  },
  {
    id: 'warning-card',
    name: 'WarningCard',
    description: 'Warning notification card',
    category: 'ui-primitives',
    importStatement: "import { WarningCard } from 'bitcoin-auth-ui';",
    codeExample: `<WarningCard
  title="Important"
  message="Please backup your recovery phrase"
/>`,
    props: [
      { name: 'title', type: 'string', required: false, description: 'Warning title' },
      { name: 'message', type: 'string', required: true, description: 'Warning message' }
    ]
  },

  // Layout Components
  {
    id: 'auth-layout',
    name: 'AuthLayout',
    description: 'Full-page authentication layout',
    category: 'layouts',
    importStatement: "import { AuthLayout } from 'bitcoin-auth-ui';",
    codeExample: `<AuthLayout
  header={<Logo />}
  footer={<Links />}
>
  <LoginForm />
</AuthLayout>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Main content' },
      { name: 'header', type: 'ReactNode', required: false, description: 'Header content' },
      { name: 'footer', type: 'ReactNode', required: false, description: 'Footer content' }
    ]
  },
  {
    id: 'centered-layout',
    name: 'CenteredLayout',
    description: 'Centered content layout with dark theme',
    category: 'layouts',
    importStatement: "import { CenteredLayout } from 'bitcoin-auth-ui';",
    codeExample: `<CenteredLayout>
  <AuthCard>
    <h1>Welcome</h1>
    <LoginForm />
  </AuthCard>
</CenteredLayout>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Content to center' }
    ]
  },
  {
    id: 'loading-layout',
    name: 'LoadingLayout',
    description: 'Full-screen loading state',
    category: 'layouts',
    importStatement: "import { LoadingLayout } from 'bitcoin-auth-ui';",
    codeExample: `<LoadingLayout
  message="Authenticating..."
/>`,
    props: [
      { name: 'message', type: 'string', required: false, description: 'Loading message' }
    ]
  },
  {
    id: 'error-layout',
    name: 'ErrorLayout',
    description: 'Full-screen error display',
    category: 'layouts',
    importStatement: "import { ErrorLayout } from 'bitcoin-auth-ui';",
    codeExample: `<ErrorLayout
  error="Something went wrong"
  onRetry={() => window.location.reload()}
/>`,
    props: [
      { name: 'error', type: 'string | Error', required: true, description: 'Error to display' },
      { name: 'onRetry', type: '() => void', required: false, description: 'Retry callback' }
    ]
  },
  {
    id: 'success-layout',
    name: 'SuccessLayout',
    description: 'Full-screen success state',
    category: 'layouts',
    importStatement: "import { SuccessLayout } from 'bitcoin-auth-ui';",
    codeExample: `<SuccessLayout
  message="Account created successfully!"
  onContinue={() => router.push('/dashboard')}
/>`,
    props: [
      { name: 'message', type: 'string', required: true, description: 'Success message' },
      { name: 'onContinue', type: '() => void', required: false, description: 'Continue callback' }
    ]
  },

  // Hooks & Utilities
  {
    id: 'use-bitcoin-auth',
    name: 'useBitcoinAuth',
    description: 'Primary authentication hook',
    category: 'hooks',
    importStatement: "import { useBitcoinAuth } from 'bitcoin-auth-ui';",
    codeExample: `const {
  user,
  isAuthenticated,
  isLoading,
  signIn,
  signUp,
  signOut,
  reset
} = useBitcoinAuth();`,
    props: [
      { name: 'user', type: 'AuthUser | null', required: false, description: 'Current authenticated user' },
      { name: 'isAuthenticated', type: 'boolean', required: false, description: 'Authentication state' },
      { name: 'isLoading', type: 'boolean', required: false, description: 'Loading state' },
      { name: 'signIn', type: '(password: string) => Promise<void>', required: false, description: 'Sign in function' },
      { name: 'signUp', type: '(password: string) => Promise<void>', required: false, description: 'Sign up function' },
      { name: 'signOut', type: '() => void', required: false, description: 'Sign out function' },
      { name: 'reset', type: '() => void', required: false, description: 'Reset auth state' }
    ]
  },
  {
    id: 'use-handcash',
    name: 'useHandCash',
    description: 'HandCash wallet integration hook',
    category: 'hooks',
    importStatement: "import { useHandCash } from 'bitcoin-auth-ui';",
    codeExample: `const {
  isConnected,
  profile,
  authToken,
  startOAuth,
  disconnect
} = useHandCash(config);`,
    props: [
      { name: 'config', type: 'HandCashConfig', required: true, description: 'HandCash configuration' }
    ]
  },
  {
    id: 'use-yours-wallet',
    name: 'useYoursWallet',
    description: 'Yours Wallet integration hook',
    category: 'hooks',
    importStatement: "import { useYoursWallet } from 'bitcoin-auth-ui';",
    codeExample: `const {
  isInstalled,
  isConnected,
  publicKey,
  connect,
  disconnect
} = useYoursWallet();`,
    props: []
  }
];