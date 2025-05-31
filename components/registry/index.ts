export interface ComponentRegistryItem {
  name: string;
  title: string;
  description: string;
  category: string;
  promptPath: string;
  dependencies?: string[];
  props?: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
  }>;
}

export const componentRegistry: ComponentRegistryItem[] = [
  // Authentication Components
  {
    name: 'auth-button',
    title: 'AuthButton',
    description: 'Simple authentication trigger button for Bitcoin-based auth',
    category: 'Authentication',
    promptPath: '/components/registry/prompts/auth-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'login-form',
    title: 'LoginForm',
    description: 'Complete login form with multiple modes (signin/signup/restore)',
    category: 'Authentication',
    promptPath: '/components/registry/prompts/login-form.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'signup-flow',
    title: 'SignupFlow',
    description: 'Multi-step signup process with identity generation',
    category: 'Authentication',
    promptPath: '/components/registry/prompts/signup-flow.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'oauth-providers',
    title: 'OAuthProviders',
    description: 'OAuth provider selection for backup anchoring',
    category: 'Authentication',
    promptPath: '/components/registry/prompts/oauth-providers.md',
    dependencies: ['bigblocks'],
  },
  
  // Profile Components
  {
    name: 'profile-card',
    title: 'ProfileCard',
    description: 'Display user profile information with actions',
    category: 'Profile',
    promptPath: '/components/registry/prompts/profile-card.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'profile-editor',
    title: 'ProfileEditor',
    description: 'Edit profile information with real-time validation',
    category: 'Profile',
    promptPath: '/components/registry/prompts/profile-editor.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'profile-switcher',
    title: 'ProfileSwitcher',
    description: 'Switch between multiple user profiles',
    category: 'Profile',
    promptPath: '/components/registry/prompts/profile-switcher.md',
    dependencies: ['bigblocks'],
  },
  
  // Wallet Components
  {
    name: 'send-bsv-button',
    title: 'SendBSVButton',
    description: 'Send Bitcoin SV with a simple button interface',
    category: 'Wallet',
    promptPath: '/components/registry/prompts/send-bsv-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'donate-button',
    title: 'DonateButton',
    description: 'Accept Bitcoin donations with customizable amounts',
    category: 'Wallet',
    promptPath: '/components/registry/prompts/donate-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'wallet-overview',
    title: 'WalletOverview',
    description: 'Display wallet balance and transaction history',
    category: 'Wallet',
    promptPath: '/components/registry/prompts/wallet-overview.md',
    dependencies: ['bigblocks'],
  },
  
  // Social Components
  {
    name: 'post-button',
    title: 'PostButton',
    description: 'Create on-chain social posts',
    category: 'Social',
    promptPath: '/components/registry/prompts/post-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'like-button',
    title: 'LikeButton',
    description: 'Like content with on-chain reactions',
    category: 'Social',
    promptPath: '/components/registry/prompts/like-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'follow-button',
    title: 'FollowButton',
    description: 'Follow users with on-chain connections',
    category: 'Social',
    promptPath: '/components/registry/prompts/follow-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'loading-button',
    title: 'LoadingButton',
    description: 'Button with loading states and animations',
    category: 'UI',
    promptPath: '/components/registry/prompts/loading-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'modal',
    title: 'Modal',
    description: 'Reusable modal with animations and accessibility',
    category: 'UI',
    promptPath: '/components/registry/prompts/modal.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'password-input',
    title: 'PasswordInput',
    description: 'Secure password input with visibility toggle',
    category: 'UI',
    promptPath: '/components/registry/prompts/password-input.md',
    dependencies: ['bigblocks'],
  },
  
  // Social Components continued
  {
    name: 'social-feed',
    title: 'SocialFeed',
    description: 'Display feed of on-chain social posts',
    category: 'Social',
    promptPath: '/components/registry/prompts/social-feed.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'post-card',
    title: 'PostCard',
    description: 'Display individual social posts',
    category: 'Social',
    promptPath: '/components/registry/prompts/post-card.md',
    dependencies: ['bigblocks'],
  },
  
  // UI Components
  {
    name: 'loading-button',
    title: 'LoadingButton',
    description: 'Button with loading states and animations',
    category: 'UI',
    promptPath: '/components/registry/prompts/loading-button.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'modal',
    title: 'Modal',
    description: 'Reusable modal with animations and accessibility',
    category: 'UI',
    promptPath: '/components/registry/prompts/modal.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'password-input',
    title: 'PasswordInput',
    description: 'Secure password input with visibility toggle',
    category: 'UI',
    promptPath: '/components/registry/prompts/password-input.md',
    dependencies: ['bigblocks'],
  },
  
  // Backup & Security
  {
    name: 'backup-download',
    title: 'BackupDownload',
    description: 'Download encrypted wallet backups',
    category: 'Backup & Recovery',
    promptPath: '/components/registry/prompts/backup-download.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'file-import',
    title: 'FileImport',
    description: 'Import wallet files with drag & drop',
    category: 'Backup & Recovery',
    promptPath: '/components/registry/prompts/file-import.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'mnemonic-display',
    title: 'MnemonicDisplay',
    description: 'Display recovery phrases securely',
    category: 'Backup & Recovery',
    promptPath: '/components/registry/prompts/mnemonic-display.md',
    dependencies: ['bigblocks'],
  },
  {
    name: 'device-link-qr',
    title: 'DeviceLinkQR',
    description: 'QR code for secure device linking',
    category: 'Backup & Recovery',
    promptPath: '/components/registry/prompts/device-link-qr.md',
    dependencies: ['bigblocks'],
  },
];