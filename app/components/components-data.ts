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
  requirements?: Array<{
    type: 'provider' | 'funding' | 'backend';
    name: string;
    description: string;
    link?: string;
  }>;
}

export const componentCategories = [
  {
    id: 'providers',
    name: 'Providers',
    icon: 'Package',
    description: 'Context providers and configuration'
  },
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
    id: 'profile-management',
    name: 'Profile Management',
    icon: 'Fingerprint',
    description: 'Identity and profile management'
  },
  {
    id: 'market',
    name: 'Marketplace',
    icon: 'Package',
    description: 'Trading and marketplace components'
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'Package', 
    description: 'Social media and bSocial components'
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: 'Wallet',
    description: 'BSV wallet and transaction components'
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
  },
  {
    id: 'core-utilities',
    name: 'Core Utilities',
    icon: 'Code2',
    description: 'Core classes and utilities'
  },
  {
    id: 'droplit',
    name: 'Droplit',
    icon: 'Code2',
    description: 'Droplit API integration components'
  }
];

export const components: ComponentExample[] = [
  // Authentication Flows
  {
    id: 'auth-flow-orchestrator',
    name: 'AuthFlowOrchestrator',
    description: 'Smart authentication flow manager that handles signup, signin, and recovery. Requires backend: /api/auth/[...nextauth], /api/backup, /api/users/link-backup',
    category: 'auth-flows',
    importStatement: "import { AuthFlowOrchestrator } from 'bigblocks';",
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
    description: 'Multi-step signup process with identity generation. Requires backend: /api/users/create-from-backup, /api/backup',
    category: 'auth-flows',
    importStatement: "import { SignupFlow } from 'bigblocks';",
    codeExample: `<SignupFlow
  onSuccess={(user) => console.log('Signup complete:', user)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: false, description: 'Callback on successful signup' },
      { name: 'onError', type: '(error: AuthError) => void', required: false, description: 'Error callback' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'oauth-restore-flow',
    name: 'OAuthRestoreFlow',
    description: 'Complete OAuth backup restoration with password decryption. Requires backend: /api/auth/callback/oauth, /api/backup',
    category: 'auth-flows',
    importStatement: "import { OAuthRestoreFlow } from 'bigblocks';",
    codeExample: `<OAuthRestoreFlow
  showProviderSelection={true}
  showPasswordEntry={true}
  onRestoreSuccess={(bapId) => console.log('Restored:', bapId)}
  onRestoreError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'showProviderSelection', type: 'boolean', required: false, description: 'Show provider selection step' },
      { name: 'showPasswordEntry', type: 'boolean', required: false, description: 'Show password entry step' },
      { name: 'onRestoreSuccess', type: '(bapId: string) => void', required: false, description: 'Callback on successful restore' },
      { name: 'onRestoreError', type: '(error: string) => void', required: false, description: 'Error callback' },
      { name: 'onFlowComplete', type: '() => void', required: false, description: 'Flow completion callback' }
    ]
  },

  // Core Components
  {
    id: 'auth-button',
    name: 'AuthButton',
    description: 'Drop-in authentication button that handles the complete flow. Requires backend: Full auth API integration',
    category: 'core',
    importStatement: "import { AuthButton } from 'bigblocks';",
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
    id: 'login-form-basic',
    name: 'LoginForm',
    description: 'Basic login form with password input. Requires backend: /api/auth/[...nextauth]',
    category: 'core',
    importStatement: "import { LoginForm } from 'bigblocks';",
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
    id: 'login-form-advanced',
    name: 'LoginForm (Advanced)',
    description: 'Bitcoin-based login form with password recovery options. Requires backend: /api/auth/[...nextauth], backup APIs',
    category: 'core',
    importStatement: "import { LoginForm } from 'bigblocks';",
    codeExample: `<LoginForm
  mode="signin"
  onSuccess={(user) => console.log('Success:', user)}
/>`,
    props: [
      { name: 'mode', type: "'signin' | 'signup' | 'restore'", required: false, description: 'Authentication mode' },
      { name: 'onSuccess', type: '(user: AuthUser) => void', required: false, description: 'Success callback' },
      { name: 'onError', type: '(error: AuthError) => void', required: false, description: 'Error callback' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },

  // OAuth & Wallets
  {
    id: 'oauth-providers',
    name: 'OAuthProviders',
    description: 'OAuth provider selection with loading and linked states. Requires backend: /api/auth/link-provider, /api/users/connected-accounts',
    category: 'oauth-wallets',
    importStatement: "import { OAuthProviders } from 'bigblocks';",
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
    importStatement: "import { HandCashConnector } from 'bigblocks';",
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
    importStatement: "import { YoursWalletConnector } from 'bigblocks';",
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
    description: 'Modal for resolving OAuth account conflicts. Requires backend: /api/users/transfer-oauth',
    category: 'oauth-wallets',
    importStatement: "import { OAuthConflictModal } from 'bigblocks';",
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

  // Marketplace Components
  {
    id: 'market-table',
    name: 'MarketTable',
    description: 'Display marketplace listings with buy/sell functionality. Requires backend: /api/market/listings, /api/market/buy',
    category: 'market',
    importStatement: "import { MarketTable } from 'bigblocks';",
    codeExample: `<MarketTable
  listings={marketListings}
  onListingClick={(listing) => console.log('Selected:', listing)}
  onBuySuccess={(txid, listing) => console.log('Bought:', txid)}
  onBuyError={(error) => console.error('Error:', error)}
  loading={false}
  showAssetType={true}
  showSeller={true}
/>`,
    props: [
      { name: 'listings', type: 'MarketListing[]', required: true, description: 'Array of market listings' },
      { name: 'onListingClick', type: '(listing: MarketListing) => void', required: false, description: 'Listing click handler' },
      { name: 'onBuySuccess', type: '(txid: string, listing: MarketListing) => void', required: false, description: 'Buy success callback' },
      { name: 'onBuyError', type: '(error: Error, listing: MarketListing) => void', required: false, description: 'Buy error callback' },
      { name: 'loading', type: 'boolean', required: false, description: 'Loading state' },
      { name: 'showAssetType', type: 'boolean', required: false, description: 'Show asset type column' },
      { name: 'showSeller', type: 'boolean', required: false, description: 'Show seller column' },
      { name: 'maxItems', type: 'number', required: false, description: 'Maximum items to display' }
    ]
  },
  {
    id: 'create-listing-button',
    name: 'CreateListingButton',
    description: 'Create new marketplace listings. Requires backend: /api/market/create, /api/wallet/utxos, /api/wallet/broadcast',
    category: 'market',
    importStatement: "import { CreateListingButton } from 'bigblocks';",
    codeExample: `<CreateListingButton
  onSuccess={(result) => console.log('Created:', result)}
  onError={(error) => console.error('Error:', error)}
  buttonText="List Item for Sale"
  variant="solid"
  size="3"
/>`,
    props: [
      { name: 'onSuccess', type: '(result: string | object) => void', required: true, description: 'Success callback with result' },
      { name: 'onError', type: '(error: Error) => void', required: true, description: 'Error callback' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button text' },
      { name: 'variant', type: "'solid' | 'outline' | 'ghost'", required: false, description: 'Button variant' },
      { name: 'size', type: "'1' | '2' | '3' | '4'", required: false, description: 'Button size' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'buy-listing-button',
    name: 'BuyListingButton',
    description: 'Purchase marketplace listings. Requires backend: /api/market/buy, /api/wallet/utxos, /api/wallet/broadcast',
    category: 'market',
    importStatement: "import { BuyListingButton } from 'bigblocks';",
    codeExample: `<BuyListingButton
  listing={selectedListing}
  onSuccess={(txid) => console.log('Purchased:', txid)}
  onError={(error) => console.error('Error:', error)}
  buttonText="Buy Now"
  variant="solid"
  showDetails={true}
/>`,
    props: [
      { name: 'listing', type: 'MarketListing', required: true, description: 'Listing to purchase' },
      { name: 'onSuccess', type: '(txid: string) => void', required: true, description: 'Success callback with transaction ID' },
      { name: 'onError', type: '(error: Error) => void', required: true, description: 'Error callback' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button text' },
      { name: 'variant', type: "'solid' | 'outline' | 'ghost'", required: false, description: 'Button variant' },
      { name: 'size', type: "'1' | '2' | '3' | '4'", required: false, description: 'Button size' },
      { name: 'showDetails', type: 'boolean', required: false, description: 'Show listing details' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },

  // Social Components  
  {
    id: 'post-button',
    name: 'PostButton',
    description: 'Create social posts on Bitcoin. Requires backend: /api/social/post',
    category: 'social',
    importStatement: "import { PostButton } from 'bigblocks';",
    codeExample: `<PostButton
  onSuccess={(result) => console.log('Posted:', result)}
  onError={(error) => console.error('Error:', error)}
  buttonText="Share Your Thoughts"
  variant="solid"
/>`,
    props: [
      { name: 'onSuccess', type: '(result: object) => void', required: false, description: 'Success callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button text' },
      { name: 'variant', type: "'solid' | 'outline' | 'ghost'", required: false, description: 'Button variant' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ],
    requirements: [
      { type: 'provider', name: 'BitcoinQueryProvider', description: 'Required for social data mutations', link: '#bitcoin-query-provider' },
      { type: 'backend', name: 'Social APIs', description: 'Needs /api/social/post endpoint' },
      { type: 'funding', name: 'Transaction Fees', description: 'Posts are Bitcoin transactions requiring small fees' }
    ]
  },
  {
    id: 'like-button',
    name: 'LikeButton',
    description: 'Like/unlike posts on Bitcoin. Requires backend: /api/social/like',
    category: 'social',
    importStatement: "import { LikeButton } from 'bigblocks';",
    codeExample: `<LikeButton
  txid="post-transaction-id"
  onLike={(txid, emoji) => console.log('Liked!', txid, emoji)}
  onUnlike={(txid, emoji) => console.log('Unliked!', txid, emoji)}
  variant="soft"
/>`,
    props: [
      { name: 'txid', type: 'string', required: true, description: 'Post transaction ID' },
      { name: 'onLike', type: '(txid: string, emoji: string) => void', required: false, description: 'Like callback' },
      { name: 'onUnlike', type: '(txid: string, emoji: string) => void', required: false, description: 'Unlike callback' },
      { name: 'variant', type: "'solid' | 'soft' | 'outline'", required: false, description: 'Button variant' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'follow-button',
    name: 'FollowButton',
    description: 'Follow/unfollow users on Bitcoin. Requires backend: /api/social/follow',
    category: 'social',
    importStatement: "import { FollowButton } from 'bigblocks';",
    codeExample: `<FollowButton
  idKey="user-id-key"
  onFollow={(idKey) => console.log('Followed!', idKey)}
  onUnfollow={(idKey) => console.log('Unfollowed!', idKey)}
  variant="outline"
/>`,
    props: [
      { name: 'idKey', type: 'string', required: true, description: 'User identity key to follow' },
      { name: 'onFollow', type: '(idKey: string) => void', required: false, description: 'Follow callback' },
      { name: 'onUnfollow', type: '(idKey: string) => void', required: false, description: 'Unfollow callback' },
      { name: 'variant', type: "'solid' | 'soft' | 'outline'", required: false, description: 'Button variant' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'social-feed',
    name: 'SocialFeed',
    description: 'Display social posts with infinite scroll. Requires backend: /api/social/feed, /api/social/reactions',
    category: 'social',
    importStatement: "import { SocialFeed } from 'bigblocks';",
    codeExample: `<SocialFeed
  config={{
    algorithm: 'following',
    limit: 20,
    bapId: user.bapId
  }}
  onPostClick={(post) => router.push(\`/post/\${post.txid}\`)}
  onAuthorClick={(bapId) => router.push(\`/profile/\${bapId}\`)}
  showLoadMore={true}
  variant="default"
/>`,
    props: [
      { name: 'config', type: 'SocialFeedConfig', required: true, description: 'Feed configuration' },
      { name: 'onPostClick', type: '(post: SocialPost) => void', required: false, description: 'Post click handler' },
      { name: 'onAuthorClick', type: '(bapId: string) => void', required: false, description: 'Author click handler' },
      { name: 'showLoadMore', type: 'boolean', required: false, description: 'Show load more button' },
      { name: 'variant', type: "'default' | 'compact' | 'minimal'", required: false, description: 'Feed layout variant' }
    ]
  },
  {
    id: 'post-card',
    name: 'PostCard',
    description: 'Individual social post display. Requires: Social post data object',
    category: 'social',
    importStatement: "import { PostCard } from 'bigblocks';",
    codeExample: `<PostCard
  post={socialPost}
  onLike={(txid) => handleLike(txid)}
  onReply={(txid) => setReplyingTo(txid)}
  showActions={true}
  variant="compact"
/>`,
    props: [
      { name: 'post', type: 'SocialPost', required: true, description: 'Social post object' },
      { name: 'onLike', type: '(txid: string) => void', required: false, description: 'Like button handler' },
      { name: 'onReply', type: '(txid: string) => void', required: false, description: 'Reply button handler' },
      { name: 'showActions', type: 'boolean', required: false, description: 'Show interaction buttons' },
      { name: 'variant', type: "'default' | 'compact' | 'minimal'", required: false, description: 'Card layout variant' }
    ]
  },

  // Wallet Components
  {
    id: 'send-bsv-button',
    name: 'SendBSVButton',
    description: 'Send BSV transactions with fee estimation. Requires backend: /api/wallet/utxos, /api/wallet/send, /api/wallet/broadcast',
    category: 'wallet',
    importStatement: "import { SendBSVButton } from 'bigblocks';",
    codeExample: `<SendBSVButton
  onSuccess={(result) => console.log('Sent:', result.txid)}
  onError={(error) => console.error('Error:', error)}
  buttonText="Send BSV"
  showFeeEstimate={true}
  variant="solid"
/>`,
    props: [
      { name: 'onSuccess', type: '(result: { txid: string }) => void', required: false, description: 'Success callback with transaction details' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button text' },
      { name: 'showFeeEstimate', type: 'boolean', required: false, description: 'Show fee estimation' },
      { name: 'variant', type: "'solid' | 'outline' | 'ghost'", required: false, description: 'Button variant' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ],
    requirements: [
      { type: 'provider', name: 'BitcoinQueryProvider', description: 'Required for data fetching hooks', link: '#bitcoin-query-provider' },
      { type: 'backend', name: 'Wallet APIs', description: 'Needs /api/wallet/* endpoints' },
      { type: 'funding', name: 'BSV Balance', description: 'User needs BSV to send transactions' }
    ]
  },
  {
    id: 'wallet-overview',
    name: 'WalletOverview',
    description: 'Display wallet balance and transaction history. Requires backend: /api/wallet/balance, /api/wallet/transactions',
    category: 'wallet',
    importStatement: "import { WalletOverview } from 'bigblocks';",
    codeExample: `<WalletOverview
  balance={walletBalance}
  recentTransactions={transactions}
  onTransactionClick={(txid) => router.push(\`/tx/\${txid}\`)}
  onRefresh={() => {
    refetchBalance();
    refetchTransactions();
  }}
  showTokens={true}
  showTransactions={true}
  variant="default"
/>`,
    props: [
      { name: 'balance', type: 'WalletBalance', required: false, description: 'Wallet balance object' },
      { name: 'recentTransactions', type: 'Transaction[]', required: false, description: 'Recent transactions array' },
      { name: 'onTransactionClick', type: '(txid: string) => void', required: false, description: 'Transaction click handler' },
      { name: 'onRefresh', type: '() => void', required: false, description: 'Refresh callback' },
      { name: 'showTokens', type: 'boolean', required: false, description: 'Show token balances' },
      { name: 'showTransactions', type: 'boolean', required: false, description: 'Show transaction history' },
      { name: 'variant', type: "'default' | 'compact' | 'minimal'", required: false, description: 'Layout variant' }
    ],
    requirements: [
      { type: 'provider', name: 'BitcoinQueryProvider', description: 'Required for wallet data queries', link: '#bitcoin-query-provider' },
      { type: 'backend', name: 'Wallet APIs', description: 'Needs /api/wallet/* endpoints' }
    ]
  },

  // Device & Backup
  {
    id: 'device-link-qr',
    name: 'DeviceLinkQR',
    description: 'QR code generator for device-to-device linking. Requires backend: /api/device-link/generate, /api/device-link/validate',
    category: 'device-backup',
    importStatement: "import { DeviceLinkQR } from 'bigblocks';",
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
    description: 'Export member profiles with QR codes. Requires backend: /api/member-export/generate, /api/member-export/validate, /api/member-export/download',
    category: 'device-backup',
    importStatement: "import { MemberExport } from 'bigblocks';",
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
    importStatement: "import { FileImport } from 'bigblocks';",
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
    description: 'Download encrypted backup files. Requires: Generated BAP backup object from authentication flow',
    category: 'device-backup',
    importStatement: "import { BackupDownload } from 'bigblocks';",
    codeExample: `<BackupDownload
  backup={generatedBackup} // BapMasterBackup object
  password="userPassword" // Optional - will encrypt if provided
  onDownloaded={() => console.log('Downloaded')}
  requireDownload={true}
/>`,
    props: [
      { name: 'backup', type: 'BapMasterBackup', required: true, description: 'Master backup object to download' },
      { name: 'password', type: 'string', required: false, description: 'Password to encrypt the backup' },
      { name: 'onDownloaded', type: '() => void', required: false, description: 'Download completion callback' },
      { name: 'requireDownload', type: 'boolean', required: false, description: 'Whether download is required' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'mnemonic-display',
    name: 'MnemonicDisplay',
    description: 'Display recovery phrase with acknowledgment',
    category: 'device-backup',
    importStatement: "import { MnemonicDisplay } from 'bigblocks';",
    codeExample: `<MnemonicDisplay
  mnemonic="word1 word2 word3..."
  onContinue={() => console.log('Continue')}
  showCopyButton={true}
/>`,
    props: [
      { name: 'mnemonic', type: 'string', required: true, description: 'Recovery phrase words' },
      { name: 'onContinue', type: '() => void', required: false, description: 'Continue button callback' },
      { name: 'showCopyButton', type: 'boolean', required: false, description: 'Show copy to clipboard button' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'identity-generation',
    name: 'IdentityGeneration',
    description: 'Generate new Bitcoin identities',
    category: 'device-backup',
    importStatement: "import { IdentityGeneration } from 'bigblocks';",
    codeExample: `<IdentityGeneration
  onGenerate={() => handleGenerateIdentity()}
  onImport={(file) => handleImportFile(file)}
  loading={isGenerating}
  error={generationError}
/>`,
    props: [
      { name: 'onGenerate', type: '() => void', required: true, description: 'Generate button click handler' },
      { name: 'onImport', type: '(file: File) => void', required: true, description: 'Import file handler' },
      { name: 'loading', type: 'boolean', required: false, description: 'Loading state' },
      { name: 'error', type: 'string', required: false, description: 'Error message' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'qr-code-renderer',
    name: 'QRCodeRenderer',
    description: 'Render QR codes for Bitcoin addresses, URIs, and data',
    category: 'device-backup',
    importStatement: "import { QRCodeRenderer } from 'bigblocks';",
    codeExample: `<QRCodeRenderer
  value="bitcoin:1Address123...?amount=0.001"
  size={200}
  level="M"
  includeMargin={true}
/>`,
    props: [
      { name: 'value', type: 'string', required: true, description: 'Data to encode in QR code' },
      { name: 'size', type: 'number', required: false, description: 'QR code size in pixels' },
      { name: 'level', type: "'L' | 'M' | 'Q' | 'H'", required: false, description: 'Error correction level' },
      { name: 'includeMargin', type: 'boolean', required: false, description: 'Include white margin around QR code' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },

  // UI Primitives
  {
    id: 'loading-button',
    name: 'LoadingButton',
    description: 'Button with loading states',
    category: 'ui-primitives',
    importStatement: "import { LoadingButton } from 'bigblocks';",
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
    importStatement: "import { PasswordInput } from 'bigblocks';",
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
    importStatement: "import { StepIndicator } from 'bigblocks';",
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
    importStatement: "import { Modal } from 'bigblocks';",
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
    importStatement: "import { ErrorDisplay } from 'bigblocks';",
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
    importStatement: "import { WarningCard } from 'bigblocks';",
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
    importStatement: "import { AuthLayout } from 'bigblocks';",
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
    importStatement: "import { CenteredLayout } from 'bigblocks';",
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
    importStatement: "import { LoadingLayout } from 'bigblocks';",
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
    importStatement: "import { ErrorLayout } from 'bigblocks';",
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
    importStatement: "import { SuccessLayout } from 'bigblocks';",
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
    importStatement: "import { useBitcoinAuth } from 'bigblocks';",
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
    importStatement: "import { useHandCash } from 'bigblocks';",
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
    importStatement: "import { useYoursWallet } from 'bigblocks';",
    codeExample: `const {
  isInstalled,
  isConnected,
  publicKey,
  connect,
  disconnect
} = useYoursWallet();`,
    props: []
  },
  
  // Additional components not previously included
  {
    id: 'bitcoin-auth-provider',
    name: 'BitcoinAuthProvider',
    description: 'Main context provider for Bitcoin authentication. Requires: Backend API configuration and base URL setup',
    category: 'core',
    importStatement: "import { BitcoinAuthProvider } from 'bigblocks';",
    codeExample: `<BitcoinAuthProvider config={{ apiUrl: '/api' }}>
  <App />
</BitcoinAuthProvider>`,
    props: [
      { name: 'config', type: 'AuthConfig', required: false, description: 'Authentication configuration' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Child components' }
    ]
  },
  {
    id: 'oauth-restore-form',
    name: 'OAuthRestoreForm',
    description: 'Password form for decrypting OAuth backups. Requires: OAuth provider context and encrypted backup data',
    category: 'oauth-wallets',
    importStatement: "import { OAuthRestoreForm } from 'bigblocks';",
    codeExample: `<OAuthRestoreForm
  provider={googleProvider}
  encryptedBackup={encryptedBackupString}
  onSuccess={(decryptedBackup) => handleDecrypted(decryptedBackup)}
  onError={(error) => console.error(error)}
/>`,
    props: [
      { name: 'provider', type: 'OAuthProvider', required: true, description: 'OAuth provider object' },
      { name: 'encryptedBackup', type: 'string', required: true, description: 'Encrypted backup string' },
      { name: 'onSuccess', type: '(decryptedBackup: string) => void', required: true, description: 'Success handler with decrypted backup' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error handler' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'backup-import',
    name: 'BackupImport',
    description: 'Simple backup file import component',
    category: 'device-backup',
    importStatement: "import { BackupImport } from 'bigblocks';",
    codeExample: `<BackupImport
  onImport={async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleFileImport(file);
  }}
/>`,
    props: [
      { name: 'onImport', type: '(e: ChangeEvent<HTMLInputElement>) => void', required: true, description: 'File input change handler' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the input' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'qr-code-renderer',
    name: 'QRCodeRenderer',
    description: 'Utility component for rendering QR codes',
    category: 'ui-primitives',
    importStatement: "import { QRCodeRenderer } from 'bigblocks';",
    codeExample: `<QRCodeRenderer
  data="bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
  size={200}
  level="M"
/>`,
    props: [
      { name: 'data', type: 'string', required: true, description: 'Data to encode in QR code' },
      { name: 'size', type: 'number', required: false, description: 'Size of QR code in pixels' },
      { name: 'level', type: "'L' | 'M' | 'Q' | 'H'", required: false, description: 'Error correction level' }
    ]
  },
  {
    id: 'use-auth-messages',
    name: 'useAuthMessages',
    description: 'Hook for customizing authentication messages',
    category: 'hooks',
    importStatement: "import { useAuthMessages } from 'bigblocks';",
    codeExample: `const messages = useAuthMessages({
  signIn: {
    title: 'Welcome Back!',
    button: 'Access My Wallet',
    passwordPlaceholder: 'Enter your secret phrase'
  }
});`,
    props: []
  },
  
  // BAP Components
  {
    id: 'bap-key-rotation-manager',
    name: 'BapKeyRotationManager',
    description: 'Manage BAP identity key rotation schedules and execute rotations. Requires BAP instance from authenticated user context',
    category: 'device-backup',
    importStatement: "import { BapKeyRotationManager } from 'bigblocks';",
    codeExample: `<BapKeyRotationManager
  bapInstance={bapInstance}
  onRotationComplete={(event) => console.log('Rotation complete:', event)}
  onError={(error) => console.error('Rotation error:', error)}
/>`,
    props: [
      { name: 'bapInstance', type: 'BAP | ExtendedBAP', required: true, description: 'BAP instance from user context' },
      { name: 'onRotationComplete', type: '(event: BapKeyRotationEvent) => void', required: false, description: 'Rotation completion callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'bap-file-signer',
    name: 'BapFileSigner',
    description: 'Sign files with BAP identity for cryptographic proof of authorship. Requires BAP instance',
    category: 'device-backup',
    importStatement: "import { BapFileSigner } from 'bigblocks';",
    codeExample: `<BapFileSigner
  bapInstance={bapInstance}
  onSignComplete={(result) => console.log('File signed:', result)}
  onError={(error) => console.error('Signing error:', error)}
/>`,
    props: [
      { name: 'bapInstance', type: 'BAP | ExtendedBAP', required: true, description: 'BAP instance from user context' },
      { name: 'onSignComplete', type: '(result: FileSigningResult) => void', required: false, description: 'Signing completion callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'bap-encryption-suite',
    name: 'BapEncryptionSuite',
    description: 'Encrypt and decrypt data using BAP identity keys. Supports multiple encryption modes',
    category: 'device-backup',
    importStatement: "import { BapEncryptionSuite } from 'bigblocks';",
    codeExample: `<BapEncryptionSuite
  bapInstance={bapInstance}
  mode="encrypt"
  onEncryptComplete={(result) => console.log('Encrypted:', result)}
  onDecryptComplete={(result) => console.log('Decrypted:', result)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'bapInstance', type: 'BAP | ExtendedBAP', required: true, description: 'BAP instance from user context' },
      { name: 'mode', type: "'encrypt' | 'decrypt'", required: true, description: 'Operation mode' },
      { name: 'onEncryptComplete', type: '(result: EncryptedData) => void', required: false, description: 'Encryption callback' },
      { name: 'onDecryptComplete', type: '(result: DecryptedData) => void', required: false, description: 'Decryption callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  
  // Market Components
  {
    id: 'quick-list-button',
    name: 'QuickListButton',
    description: 'One-click marketplace listing creation. Requires backend: /api/market/list',
    category: 'market',
    importStatement: "import { QuickListButton } from 'bigblocks';",
    codeExample: `<QuickListButton
  assetId="ordinal-123"
  assetType="ordinal"
  onSuccess={(txid) => console.log('Listed:', txid)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'assetId', type: 'string', required: true, description: 'Asset identifier to list' },
      { name: 'assetType', type: "'ordinal' | 'token' | 'nft'", required: true, description: 'Type of asset' },
      { name: 'onSuccess', type: '(txid: string) => void', required: false, description: 'Success callback with transaction ID' },
      { name: 'onError', type: '(error: MarketError) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'quick-buy-button',
    name: 'QuickBuyButton',
    description: 'Instant purchase button for marketplace listings. Requires backend: /api/market/buy',
    category: 'market',
    importStatement: "import { QuickBuyButton } from 'bigblocks';",
    codeExample: `<QuickBuyButton
  listing={listing}
  onSuccess={(txid) => console.log('Purchased:', txid)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'listing', type: 'MarketListing', required: true, description: 'Listing to purchase' },
      { name: 'onSuccess', type: '(txid: string) => void', required: false, description: 'Purchase success callback' },
      { name: 'onError', type: '(error: MarketError) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'compact-market-table',
    name: 'CompactMarketTable',
    description: 'Compact version of marketplace listings table for sidebars and widgets',
    category: 'market',
    importStatement: "import { CompactMarketTable } from 'bigblocks';",
    codeExample: `<CompactMarketTable
  listings={listings}
  onListingClick={(listing) => console.log('Selected:', listing)}
/>`,
    props: [
      { name: 'listings', type: 'MarketListing[]', required: true, description: 'Array of market listings' },
      { name: 'onListingClick', type: '(listing: MarketListing) => void', required: false, description: 'Listing click handler' },
      { name: 'maxItems', type: 'number', required: false, description: 'Maximum items to display' }
    ]
  },
  
  // Developer Tools
  {
    id: 'shamir-secret-sharing',
    name: 'ShamirSecretSharing',
    description: 'Split and reconstruct secrets using Shamir\'s Secret Sharing algorithm',
    category: 'device-backup',
    importStatement: "import { ShamirSecretSharing } from 'bigblocks';",
    codeExample: `<ShamirSecretSharing
  mode="demo"
  onSharesGenerated={(shares) => console.log('Shares:', shares)}
  onSecretRecovered={(secret) => console.log('Secret:', secret)}
/>`,
    props: [
      { name: 'mode', type: "'split' | 'recover' | 'demo'", required: true, description: 'Operation mode' },
      { name: 'onSharesGenerated', type: '(shares: string[]) => void', required: false, description: 'Shares generation callback' },
      { name: 'onSecretRecovered', type: '(secret: string) => void', required: false, description: 'Secret recovery callback' }
    ]
  },
  {
    id: 'type42-key-derivation',
    name: 'Type42KeyDerivation',
    description: 'BRC-42 deterministic key derivation for creating domain-specific keys',
    category: 'device-backup',
    importStatement: "import { Type42KeyDerivation } from 'bigblocks';",
    codeExample: `<Type42KeyDerivation
  onKeyDerived={(derivedKey) => console.log('Derived:', derivedKey)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'onKeyDerived', type: '(derivedKey: DerivedKey) => void', required: false, description: 'Key derivation callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'key-manager',
    name: 'KeyManager',
    description: 'Comprehensive key management system for generating, importing, and managing Bitcoin keys',
    category: 'device-backup',
    importStatement: "import { KeyManager } from 'bigblocks';",
    codeExample: `<KeyManager
  onKeyGenerated={(key) => console.log('Generated:', key)}
  onKeyImported={(key) => console.log('Imported:', key)}
  onKeyDeleted={(keyId) => console.log('Deleted:', keyId)}
/>`,
    props: [
      { name: 'onKeyGenerated', type: '(key: StoredKey) => void', required: false, description: 'Key generation callback' },
      { name: 'onKeyImported', type: '(key: StoredKey) => void', required: false, description: 'Key import callback' },
      { name: 'onKeyDeleted', type: '(keyId: string) => void', required: false, description: 'Key deletion callback' }
    ]
  },
  {
    id: 'artifact-display',
    name: 'ArtifactDisplay',
    description: 'Display various Bitcoin artifact types including text, JSON, images, and more',
    category: 'ui-primitives',
    importStatement: "import { ArtifactDisplay, ArtifactType } from 'bigblocks';",
    codeExample: `<ArtifactDisplay
  artifact={{
    type: ArtifactType.JSON,
    data: { message: 'Bitcoin data' }
  }}
/>`,
    props: [
      { name: 'artifact', type: 'ArtifactData', required: true, description: 'Artifact data to display' },
      { name: 'maxHeight', type: 'string', required: false, description: 'Maximum display height' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },
  {
    id: 'theme-demo',
    name: 'ThemeDemo',
    description: 'Interactive demonstration of all available Bitcoin theme presets',
    category: 'ui-primitives',
    importStatement: "import { ThemeDemo } from 'bigblocks';",
    codeExample: `<ThemeDemo />`,
    props: []
  },
  {
    id: 'cyberpunk-demo',
    name: 'CyberpunkDemo',
    description: 'Showcase of the cyberpunk theme variant with neon effects',
    category: 'ui-primitives',
    importStatement: "import { CyberpunkDemo } from 'bigblocks';",
    codeExample: `<CyberpunkDemo />`,
    props: []
  },
  
  // Social Components
  {
    id: 'message-display',
    name: 'MessageDisplay',
    description: 'Display direct messages sent via Bitcoin blockchain',
    category: 'social',
    importStatement: "import { MessageDisplay } from 'bigblocks';",
    codeExample: `<MessageDisplay
  message={message}
  showTimestamp={true}
  showActions={true}
/>`,
    props: [
      { name: 'message', type: 'SocialMessage', required: true, description: 'Message to display' },
      { name: 'showTimestamp', type: 'boolean', required: false, description: 'Show message timestamp' },
      { name: 'showActions', type: 'boolean', required: false, description: 'Show message actions' }
    ]
  },
  {
    id: 'friends-dialog',
    name: 'FriendsDialog',
    description: 'Friends list management dialog with social actions',
    category: 'social',
    importStatement: "import { FriendsDialog } from 'bigblocks';",
    codeExample: `<FriendsDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  friends={friends}
  onFriendClick={(friend) => console.log('Friend:', friend)}
  onFriendAction={(action, friend) => console.log(action, friend)}
/>`,
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Dialog open state' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close dialog handler' },
      { name: 'friends', type: 'SocialFriend[]', required: true, description: 'Array of friends' },
      { name: 'onFriendClick', type: '(friend: SocialFriend) => void', required: false, description: 'Friend click handler' },
      { name: 'onFriendAction', type: '(action: string, friend: SocialFriend) => void', required: false, description: 'Friend action handler' }
    ]
  },
  
  // Wallet Components (Additional)
  {
    id: 'compact-wallet-overview',
    name: 'CompactWalletOverview',
    description: 'Compact wallet display for sidebars and widgets',
    category: 'wallet',
    importStatement: "import { CompactWalletOverview } from 'bigblocks';",
    codeExample: `<CompactWalletOverview
  balance={{ satoshis: 123456789, usd: 56.78 }}
  address="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
  onSendClick={() => console.log('Send clicked')}
  onReceiveClick={() => console.log('Receive clicked')}
/>`,
    props: [
      { name: 'balance', type: 'WalletBalance', required: true, description: 'Wallet balance object' },
      { name: 'address', type: 'string', required: true, description: 'Bitcoin address' },
      { name: 'onSendClick', type: '() => void', required: false, description: 'Send button handler' },
      { name: 'onReceiveClick', type: '() => void', required: false, description: 'Receive button handler' }
    ]
  },
  {
    id: 'quick-send-button',
    name: 'QuickSendButton',
    description: 'Instant BSV sending with preset amount',
    category: 'wallet',
    importStatement: "import { QuickSendButton } from 'bigblocks';",
    codeExample: `<QuickSendButton
  recipientAddress="1QuickRecipient..."
  amount={0.001}
  onSuccess={(txid) => console.log('Quick send successful:', txid)}
  onError={(error) => console.error('Quick send error:', error)}
/>`,
    props: [
      { name: 'recipientAddress', type: 'string', required: true, description: 'Recipient Bitcoin address' },
      { name: 'amount', type: 'number', required: true, description: 'Amount in BSV to send' },
      { name: 'onSuccess', type: '(txid: string) => void', required: false, description: 'Success callback with transaction ID' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'quick-donate-button',
    name: 'QuickDonateButton',
    description: 'One-click donation button with preset amount',
    category: 'wallet',
    importStatement: "import { QuickDonateButton } from 'bigblocks';",
    codeExample: `<QuickDonateButton
  recipientAddress="1DonationAddress..."
  amount={0.01}
  recipientName="Open Source Project"
  onSuccess={(txid) => console.log('Donation successful:', txid)}
  onError={(error) => console.error('Donation error:', error)}
/>`,
    props: [
      { name: 'recipientAddress', type: 'string', required: true, description: 'Donation recipient address' },
      { name: 'amount', type: 'number', required: true, description: 'Donation amount in BSV' },
      { name: 'recipientName', type: 'string', required: false, description: 'Display name for recipient' },
      { name: 'onSuccess', type: '(txid: string) => void', required: false, description: 'Success callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  
  // UI Components (Additional)
  {
    id: 'auth-card',
    name: 'AuthCard',
    description: 'Card container component for authentication forms',
    category: 'ui-primitives',
    importStatement: "import { AuthCard } from 'bigblocks';",
    codeExample: `<AuthCard>
  <h2>Welcome</h2>
  <LoginForm />
</AuthCard>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Card content' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ]
  },

  // Provider Components
  {
    id: 'bitcoin-theme-provider',
    name: 'BitcoinThemeProvider',
    description: 'Theme provider with 8 Bitcoin-inspired color presets and customizable appearance',
    category: 'providers',
    importStatement: "import { BitcoinThemeProvider } from 'bigblocks';",
    codeExample: `<BitcoinThemeProvider 
  bitcoinTheme="orange"
  appearance="dark"
  radius="medium"
  scaling="100%"
>
  <App />
</BitcoinThemeProvider>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Child components' },
      { name: 'bitcoinTheme', type: "'orange' | 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'yellow' | 'indigo'", required: false, description: 'Bitcoin color theme preset' },
      { name: 'appearance', type: "'light' | 'dark' | 'inherit'", required: false, description: 'Theme appearance mode' },
      { name: 'radius', type: "'none' | 'small' | 'medium' | 'large' | 'full'", required: false, description: 'Border radius style' },
      { name: 'scaling', type: "'90%' | '95%' | '100%' | '105%' | '110%'", required: false, description: 'UI scaling factor' },
      { name: 'panelBackground', type: "'solid' | 'translucent'", required: false, description: 'Panel background style' }
    ]
  },
  {
    id: 'bitcoin-query-provider',
    name: 'BitcoinQueryProvider',
    description: 'React Query provider wrapper for market, wallet, and social components',
    category: 'providers',
    importStatement: "import { BitcoinQueryProvider } from 'bigblocks';",
    codeExample: `<BitcoinQueryProvider>
  {/* Market, wallet, and social components work here */}
  <MarketTable listings={listings} />
  <PostButton onSuccess={handlePost} />
</BitcoinQueryProvider>`,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Child components' },
      { name: 'queryClient', type: 'QueryClient', required: false, description: 'Custom React Query client' }
    ]
  },

  // Profile Management Components
  {
    id: 'profile-card',
    name: 'ProfileCard',
    description: 'Rich profile display component with schema.org support',
    category: 'profile-management',
    importStatement: "import { ProfileCard } from 'bigblocks';",
    codeExample: `<ProfileCard
  profile={{
    '@type': 'Person',
    name: 'Satoshi Nakamoto',
    alternateName: 'satoshi',
    description: 'Creator of Bitcoin',
    image: 'https://example.com/avatar.png'
  }}
  showActions={true}
  onEdit={() => console.log('Edit profile')}
/>`,
    props: [
      { name: 'profile', type: 'ProfileInfo', required: true, description: 'Profile data with schema.org properties' },
      { name: 'showActions', type: 'boolean', required: false, description: 'Show action buttons' },
      { name: 'onEdit', type: '() => void', required: false, description: 'Edit button handler' },
      { name: 'onShare', type: '() => void', required: false, description: 'Share button handler' }
    ]
  },
  {
    id: 'profile-editor',
    name: 'ProfileEditor',
    description: 'Form-based profile editing with schema.org field support',
    category: 'profile-management',
    importStatement: "import { ProfileEditor } from 'bigblocks';",
    codeExample: `<ProfileEditor
  profile={currentProfile}
  onSave={(updatedProfile) => console.log('Saved:', updatedProfile)}
  onCancel={() => console.log('Cancelled')}
  showAdvancedFields={true}
/>`,
    props: [
      { name: 'profile', type: 'ProfileInfo', required: true, description: 'Current profile data' },
      { name: 'onSave', type: '(profile: ProfileInfo) => void', required: true, description: 'Save handler' },
      { name: 'onCancel', type: '() => void', required: false, description: 'Cancel handler' },
      { name: 'showAdvancedFields', type: 'boolean', required: false, description: 'Show advanced schema.org fields' }
    ]
  },
  {
    id: 'profile-manager',
    name: 'ProfileManager',
    description: 'Complete profile management interface with multi-profile support',
    category: 'profile-management',
    importStatement: "import { ProfileManager } from 'bigblocks';",
    codeExample: `<ProfileManager
  profiles={userProfiles}
  activeProfileId={currentProfileId}
  onProfileSelect={(profileId) => console.log('Selected:', profileId)}
  onProfileCreate={(profile) => console.log('Created:', profile)}
  onProfileUpdate={(profileId, updates) => console.log('Updated:', profileId, updates)}
  onProfileDelete={(profileId) => console.log('Deleted:', profileId)}
/>`,
    props: [
      { name: 'profiles', type: 'ProfileInfo[]', required: true, description: 'Array of user profiles' },
      { name: 'activeProfileId', type: 'string', required: false, description: 'Currently active profile ID' },
      { name: 'onProfileSelect', type: '(profileId: string) => void', required: false, description: 'Profile selection handler' },
      { name: 'onProfileCreate', type: '(profile: ProfileInfo) => void', required: false, description: 'Profile creation handler' },
      { name: 'onProfileUpdate', type: '(profileId: string, updates: Partial<ProfileInfo>) => void', required: false, description: 'Profile update handler' },
      { name: 'onProfileDelete', type: '(profileId: string) => void', required: false, description: 'Profile deletion handler' }
    ]
  },
  {
    id: 'profile-popover',
    name: 'ProfilePopover',
    description: 'Compact profile preview in a popover component',
    category: 'profile-management',
    importStatement: "import { ProfilePopover } from 'bigblocks';",
    codeExample: `<ProfilePopover
  profile={profile}
  trigger={<button>View Profile</button>}
  showActions={true}
/>`,
    props: [
      { name: 'profile', type: 'ProfileInfo', required: true, description: 'Profile to display' },
      { name: 'trigger', type: 'ReactNode', required: true, description: 'Trigger element for popover' },
      { name: 'showActions', type: 'boolean', required: false, description: 'Show action buttons in popover' }
    ]
  },
  {
    id: 'profile-publisher',
    name: 'ProfilePublisher',
    description: 'Publish profiles to Bitcoin blockchain via BAP protocol',
    category: 'profile-management',
    importStatement: "import { ProfilePublisher } from 'bigblocks';",
    codeExample: `<ProfilePublisher
  profile={profile}
  onPublishSuccess={(txid) => console.log('Published:', txid)}
  onPublishError={(error) => console.error('Error:', error)}
  showPreview={true}
/>`,
    props: [
      { name: 'profile', type: 'ProfileInfo', required: true, description: 'Profile to publish' },
      { name: 'onPublishSuccess', type: '(txid: string) => void', required: false, description: 'Publish success handler' },
      { name: 'onPublishError', type: '(error: Error) => void', required: false, description: 'Publish error handler' },
      { name: 'showPreview', type: 'boolean', required: false, description: 'Show profile preview before publishing' }
    ]
  },
  {
    id: 'profile-switcher',
    name: 'ProfileSwitcher',
    description: 'UI component for switching between multiple profiles',
    category: 'profile-management',
    importStatement: "import { ProfileSwitcher } from 'bigblocks';",
    codeExample: `<ProfileSwitcher
  profiles={userProfiles}
  activeProfileId={currentProfileId}
  onSwitch={(profileId) => console.log('Switched to:', profileId)}
  onCreateNew={() => console.log('Create new profile')}
/>`,
    props: [
      { name: 'profiles', type: 'ProfileInfo[]', required: true, description: 'Available profiles' },
      { name: 'activeProfileId', type: 'string', required: true, description: 'Currently active profile' },
      { name: 'onSwitch', type: '(profileId: string) => void', required: true, description: 'Profile switch handler' },
      { name: 'onCreateNew', type: '() => void', required: false, description: 'Create new profile handler' }
    ]
  },
  {
    id: 'profile-viewer',
    name: 'ProfileViewer',
    description: 'Read-only profile display component',
    category: 'profile-management',
    importStatement: "import { ProfileViewer } from 'bigblocks';",
    codeExample: `<ProfileViewer
  profile={profile}
  showFullDetails={true}
  onFollow={() => console.log('Follow user')}
/>`,
    props: [
      { name: 'profile', type: 'ProfileInfo', required: true, description: 'Profile to view' },
      { name: 'showFullDetails', type: 'boolean', required: false, description: 'Show all profile fields' },
      { name: 'onFollow', type: '() => void', required: false, description: 'Follow button handler' }
    ]
  },
  {
    id: 'cloud-backup-manager',
    name: 'CloudBackupManager',
    description: 'Manage encrypted backups across multiple cloud providers',
    category: 'profile-management',
    importStatement: "import { CloudBackupManager } from 'bigblocks';",
    codeExample: `<CloudBackupManager
  providers={['google', 'github', 'dropbox']}
  connectedProviders={['google']}
  onProviderConnect={(provider) => console.log('Connect:', provider)}
  onProviderDisconnect={(provider) => console.log('Disconnect:', provider)}
  onBackupUpload={(provider) => console.log('Upload to:', provider)}
  onBackupDownload={(provider) => console.log('Download from:', provider)}
/>`,
    props: [
      { name: 'providers', type: 'string[]', required: true, description: 'Available cloud providers' },
      { name: 'connectedProviders', type: 'string[]', required: false, description: 'Currently connected providers' },
      { name: 'onProviderConnect', type: '(provider: string) => void', required: false, description: 'Provider connection handler' },
      { name: 'onProviderDisconnect', type: '(provider: string) => void', required: false, description: 'Provider disconnection handler' },
      { name: 'onBackupUpload', type: '(provider: string) => void', required: false, description: 'Backup upload handler' },
      { name: 'onBackupDownload', type: '(provider: string) => void', required: false, description: 'Backup download handler' }
    ]
  },

  // Additional Wallet Component
  {
    id: 'donate-button',
    name: 'DonateButton',
    description: 'Bitcoin donation interface with preset amounts and QR code',
    category: 'wallet',
    importStatement: "import { DonateButton } from 'bigblocks';",
    codeExample: `<DonateButton
  recipientAddress="1DonationAddress..."
  recipientName="Open Source Project"
  presetAmounts={[0.01, 0.05, 0.1, 0.5, 1]}
  onSuccess={(txid) => console.log('Donation sent:', txid)}
  onError={(error) => console.error('Error:', error)}
/>`,
    props: [
      { name: 'recipientAddress', type: 'string', required: true, description: 'Bitcoin address for donations' },
      { name: 'recipientName', type: 'string', required: false, description: 'Display name for recipient' },
      { name: 'presetAmounts', type: 'number[]', required: false, description: 'Preset donation amounts in BSV' },
      { name: 'onSuccess', type: '(txid: string) => void', required: false, description: 'Success callback' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Error callback' }
    ]
  },
  {
    id: 'token-balance',
    name: 'TokenBalance',
    description: 'Display token balances with support for multiple token types',
    category: 'wallet',
    importStatement: "import { TokenBalance } from 'bigblocks';",
    codeExample: `<TokenBalance
  tokens={[
    {
      id: 'bsv20-demo',
      symbol: 'DEMO',
      type: 'bsv20',
      decimals: 8,
      balance: { confirmed: '1000000000', unconfirmed: '0', total: '1000000000' }
    }
  ]}
  showUsdValue={true}
  onTokenClick={(token) => console.log('Token clicked:', token)}
/>`,
    props: [
      { name: 'tokens', type: 'Token[]', required: true, description: 'Array of token balances' },
      { name: 'showUsdValue', type: 'boolean', required: false, description: 'Show USD equivalent values' },
      { name: 'onTokenClick', type: '(token: Token) => void', required: false, description: 'Token click handler' }
    ]
  },

  // Additional Hook Components
  {
    id: 'use-social-post',
    name: 'useSocialPost',
    description: 'Hook for creating social posts on Bitcoin',
    category: 'hooks',
    importStatement: "import { useSocialPost } from 'bigblocks';",
    codeExample: `const { 
  createPost, 
  isPosting, 
  error 
} = useSocialPost({
  onSuccess: (result) => console.log('Posted:', result),
  onError: (error) => console.error('Error:', error)
});

// Usage
await createPost({
  content: 'Hello Bitcoin!',
  tags: ['bitcoin', 'social']
});`,
    props: []
  },
  {
    id: 'use-like-post',
    name: 'useLikePost',
    description: 'Hook for liking/unliking posts on Bitcoin',
    category: 'hooks',
    importStatement: "import { useLikePost } from 'bigblocks';",
    codeExample: `const { 
  likePost, 
  unlikePost, 
  isLiking 
} = useLikePost();

// Like a post
await likePost('post-txid-123', '❤️');

// Unlike a post
await unlikePost('post-txid-123', '❤️');`,
    props: []
  },
  {
    id: 'use-follow-user',
    name: 'useFollowUser',
    description: 'Hook for following/unfollowing users on Bitcoin',
    category: 'hooks',
    importStatement: "import { useFollowUser } from 'bigblocks';",
    codeExample: `const { 
  followUser, 
  unfollowUser, 
  isFollowing 
} = useFollowUser();

// Follow a user
await followUser('user-bap-id');

// Unfollow a user
await unfollowUser('user-bap-id');`,
    props: []
  },
  {
    id: 'use-create-listing',
    name: 'useCreateListing',
    description: 'Hook for creating marketplace listings',
    category: 'hooks',
    importStatement: "import { useCreateListing } from 'bigblocks';",
    codeExample: `const { 
  createListing, 
  isCreating, 
  error 
} = useCreateListing();

// Create a listing
const result = await createListing({
  assetType: 'ordinal',
  assetId: 'ordinal-123',
  price: 1000000, // satoshis
  description: 'Rare ordinal'
});`,
    props: []
  },
  {
    id: 'use-buy-listing',
    name: 'useBuyListing',
    description: 'Hook for purchasing marketplace listings',
    category: 'hooks',
    importStatement: "import { useBuyListing } from 'bigblocks';",
    codeExample: `const { 
  buyListing, 
  isBuying, 
  error 
} = useBuyListing();

// Buy a listing
const txid = await buyListing(marketListing);
console.log('Purchase transaction:', txid);`,
    props: []
  },
  {
    id: 'use-send-bsv',
    name: 'useSendBSV',
    description: 'Hook for sending BSV transactions',
    category: 'hooks',
    importStatement: "import { useSendBSV } from 'bigblocks';",
    codeExample: `const { 
  sendBSV, 
  isSending, 
  error, 
  estimateFee 
} = useSendBSV();

// Estimate fee
const fee = await estimateFee({
  to: '1Address...',
  amount: 0.001
});

// Send transaction
const result = await sendBSV({
  to: '1Address...',
  amount: 0.001
});`,
    props: []
  },
  {
    id: 'use-bap-key-rotation',
    name: 'useBapKeyRotation',
    description: 'Hook for BAP key rotation management',
    category: 'hooks',
    importStatement: "import { useBapKeyRotation } from 'bigblocks';",
    codeExample: `const { 
  rotateKey, 
  scheduleRotation, 
  isRotating, 
  rotationHistory 
} = useBapKeyRotation(bapInstance);

// Rotate key immediately
await rotateKey();

// Schedule rotation
scheduleRotation(new Date('2024-12-31'));`,
    props: []
  },
  {
    id: 'use-bap-signing',
    name: 'useBapSigning',
    description: 'Hook for signing data with BAP identity',
    category: 'hooks',
    importStatement: "import { useBapSigning } from 'bigblocks';",
    codeExample: `const { 
  signData, 
  signFile, 
  verifySignature, 
  isSigning 
} = useBapSigning(bapInstance);

// Sign data
const signature = await signData('Hello World');

// Sign file
const signedFile = await signFile(file);`,
    props: []
  },
  {
    id: 'use-bap-encryption',
    name: 'useBapEncryption',
    description: 'Hook for BAP-based encryption/decryption',
    category: 'hooks',
    importStatement: "import { useBapEncryption } from 'bigblocks';",
    codeExample: `const { 
  encrypt, 
  decrypt, 
  isProcessing 
} = useBapEncryption(bapInstance);

// Encrypt data
const encrypted = await encrypt('Secret message');

// Decrypt data
const decrypted = await decrypt(encrypted);`,
    props: []
  },

  // Core Utilities
  {
    id: 'auth-manager',
    name: 'AuthManager',
    description: 'Core authentication management class',
    category: 'core-utilities',
    importStatement: "import { AuthManager, createAuthManager } from 'bigblocks';",
    codeExample: `// Create auth manager instance
const authManager = createAuthManager({
  apiUrl: '/api',
  storageNamespace: 'myapp'
});

// Sign up
const user = await authManager.signUp(password);

// Sign in
const user = await authManager.signIn(password);

// Get current user
const user = authManager.getUser();`,
    props: []
  },
  {
    id: 'oauth-providers',
    name: 'OAuth Provider Utilities',
    description: 'Utilities for managing OAuth providers',
    category: 'core-utilities',
    importStatement: "import { registerOAuthProvider, getOAuthProvider, getAllOAuthProviders, buildOAuthUrl } from 'bigblocks';",
    codeExample: `// Register custom provider
registerOAuthProvider({
  id: 'custom',
  name: 'Custom Provider',
  icon: CustomIcon,
  authUrl: 'https://custom.com/oauth/authorize',
  scope: 'read:user'
});

// Get provider
const provider = getOAuthProvider('google');

// Build OAuth URL
const url = buildOAuthUrl('google', {
  redirectUri: '/auth/callback',
  state: 'random-state'
});`,
    props: []
  },
  {
    id: 'backup-utilities',
    name: 'Backup Utilities',
    description: 'Utilities for backup type detection and validation',
    category: 'core-utilities',
    importStatement: "import { detectBackupType, isBapMasterBackup, isBapMemberBackup, isOneSatBackup, isWifBackup } from 'bigblocks';",
    codeExample: `// Detect backup type
const backupType = detectBackupType(backupData);
console.log('Backup type:', backupType);

// Check specific types
if (isBapMasterBackup(backupData)) {
  console.log('This is a BAP Master backup');
}

if (isOneSatBackup(backupData)) {
  console.log('This is a OneSat backup');
}

// Get display info
const displayName = getBackupTypeDisplayName('bap-master');
const description = getBackupTypeDescription('bap-master');`,
    props: []
  },
  {
    id: 'message-system',
    name: 'Message System',
    description: 'Customizable authentication messages for i18n',
    category: 'core-utilities',
    importStatement: "import { useAuthMessages, mergeMessages, defaultMessages } from 'bigblocks';",
    codeExample: `// Use custom messages
const messages = useAuthMessages({
  signIn: {
    title: 'Welcome Back!',
    button: 'Access Wallet'
  },
  signUp: {
    title: 'Create Your Identity',
    button: 'Generate Keys'
  }
});

// Merge with defaults
const customMessages = mergeMessages(defaultMessages, {
  errors: {
    invalidPassword: 'Incorrect passphrase'
  }
});`,
    props: []
  },

  // Droplit Components
  {
    id: 'tap-button',
    name: 'TapButton',
    description: 'Tap a droplit instance to receive BSV for testing and development',
    category: 'droplit',
    importStatement: "import { TapButton } from '../droplit/components';",
    codeExample: `<TapButton
  onSuccess={(result) => {
    console.log('Droplit tapped:', result);
    // result.message: "Droplit access granted! Tap #1"
    // result.tapCount: 1
    // result.timestamp: ISO string
  }}
  onError={(error) => console.error('Error:', error)}
  buttonText="Tap Droplit"
  showTapCount={true}
  variant="solid"
  size="2"
  color="blue"
/>`,
    props: [
      { name: 'onSuccess', type: '(result: { message: string; timestamp: string; tapCount: number }) => void', required: false, description: 'Callback when tap succeeds' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Callback when tap fails' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button text (default: "Tap Droplit")' },
      { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost'", required: false, description: 'Button variant' },
      { name: 'size', type: "'1' | '2' | '3' | '4'", required: false, description: 'Button size' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the button' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
      { name: 'showTapCount', type: 'boolean', required: false, description: 'Show tap count badge (default: true)' },
      { name: 'color', type: "'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray'", required: false, description: 'Button color' }
    ],
    requirements: [
      { type: 'backend', name: 'Droplit API', description: 'Requires droplit instance and API integration' }
    ]
  },
  {
    id: 'data-push-button',
    name: 'DataPushButton',
    description: 'Push data to Bitcoin blockchain via droplit instance with protocol templates',
    category: 'droplit',
    importStatement: "import { DataPushButton } from '../droplit/components';",
    codeExample: `<DataPushButton
  onSuccess={(result) => {
    console.log('Data pushed:', result);
    // result.txid: "droplit-tx-123456789-1"
    // result.data: ["B_SOCIAL", "POST", "Hello Bitcoin!", "2024-01-01T00:00:00Z"]
    // result.template: "social-post"
  }}
  onError={(error) => console.error('Error:', error)}
  buttonText="Push Data"
  showTemplateSelector={true}
  showPreview={true}
  variant="solid"
  size="2"
  color="orange"
/>`,
    props: [
      { name: 'onSuccess', type: '(result: { txid: string; data: string[]; template: string }) => void', required: false, description: 'Callback when data push succeeds' },
      { name: 'onError', type: '(error: Error) => void', required: false, description: 'Callback when data push fails' },
      { name: 'template', type: 'DataTemplate', required: false, description: 'Predefined data template' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button text (default: "Push Data")' },
      { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost'", required: false, description: 'Button variant' },
      { name: 'size', type: "'1' | '2' | '3' | '4'", required: false, description: 'Button size' },
      { name: 'showTemplateSelector', type: 'boolean', required: false, description: 'Show protocol template selector (default: true)' },
      { name: 'showPreview', type: 'boolean', required: false, description: 'Show data preview (default: true)' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
      { name: 'color', type: "'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray'", required: false, description: 'Button color' },
      { name: 'requireAuth', type: 'boolean', required: false, description: 'Require authentication for data push' }
    ],
    requirements: [
      { type: 'backend', name: 'Droplit API', description: 'Requires droplit instance and data push endpoints' }
    ]
  }
];