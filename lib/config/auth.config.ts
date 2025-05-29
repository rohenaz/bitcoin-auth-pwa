/**
 * Authentication configuration
 * Centralized settings for all authentication-related features
 */

// Time durations in milliseconds
export const AUTH_TIME_CONFIG = {
  // Token validity
  authTokenValidity: 1000 * 60 * 10, // 10 minutes
  sessionMaxAge: 60 * 60 * 8, // 8 hours (in seconds for NextAuth)
  
  // Temporary storage TTLs
  oauthStateTTL: 600, // 10 minutes (in seconds for Redis)
  deviceLinkTTL: 600, // 10 minutes
  memberExportTTL: 600, // 10 minutes
  tempImageTTL: 300, // 5 minutes
  
  // UI timeouts
  redirectDelay: 2000, // 2 seconds
  loadingMinDisplay: 500, // 500ms minimum loading state
} as const;

// Password validation rules
export const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 256,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
  
  // Validation messages
  getValidationMessage: (minLength: number = 8) => 
    `Password must be at least ${minLength} characters`,
  
  // Check if password meets requirements
  validate: (password: string): { isValid: boolean; message?: string } => {
    if (!password || password.length < PASSWORD_CONFIG.minLength) {
      return { 
        isValid: false, 
        message: PASSWORD_CONFIG.getValidationMessage(PASSWORD_CONFIG.minLength) 
      };
    }
    
    if (password.length > PASSWORD_CONFIG.maxLength) {
      return { 
        isValid: false, 
        message: `Password must be less than ${PASSWORD_CONFIG.maxLength} characters` 
      };
    }
    
    return { isValid: true };
  }
} as const;

// OAuth provider configuration
export const OAUTH_CONFIG = {
  // Available providers (can be overridden by env)
  availableProviders: ['google', 'github', 'twitter'] as const,
  
  // Provider display names
  providerNames: {
    google: 'Google',
    github: 'GitHub',
    twitter: 'X (Twitter)',
  },
  
  // Provider-specific settings
  providers: {
    google: {
      scope: 'openid email profile',
      promptForReauth: false,
    },
    github: {
      scope: 'read:user user:email',
      promptForReauth: false,
    },
    twitter: {
      scope: 'users.read tweet.read offline.access',
      promptForReauth: false,
    },
  },
  
  // OAuth flow settings
  stateLength: 32, // characters for CSRF state
  allowMultipleAccounts: false, // Allow same OAuth account on multiple Bitcoin identities
} as const;

// Backup and encryption settings
export const BACKUP_CONFIG = {
  // File formats
  acceptedFormats: ['.json', '.txt'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // Encryption settings
  encryptionAlgorithm: 'AES-GCM',
  keyDerivationIterations: 100000,
  
  // Backup validation
  requiredFields: ['xprv', 'ids', 'mnemonic'] as const,
  optionalFields: ['label', 'createdAt'] as const,
} as const;

// API endpoints configuration
export const API_ENDPOINTS = {
  // Internal API routes
  internal: {
    auth: {
      signin: '/api/auth/signin',
      signup: '/api/auth/signup',
      signout: '/api/auth/signout',
      session: '/api/auth/session',
      linkProvider: '/api/auth/link-provider',
      callback: '/api/auth/callback',
    },
    backup: {
      get: '/api/backup',
      save: '/api/backup',
      status: '/api/backup/status',
    },
    user: {
      profile: '/api/users/profile',
      connectedAccounts: '/api/users/connected-accounts',
      createFromBackup: '/api/users/create-from-backup',
    },
    device: {
      generateLink: '/api/device-link/generate',
      validateLink: '/api/device-link/validate',
    },
  },
  
  // External services
  external: {
    blockHeight: {
      whatsOnChain: 'https://api.whatsonchain.com/v1/bsv/main/chain/info',
      blockHeaders: 'https://block-headers-service-production.up.railway.app/api/v1/chain/tip/longest',
    },
  },
} as const;

// UI/UX configuration
export const AUTH_UI_CONFIG = {
  // Form behavior
  forms: {
    autoFocusFirstField: true,
    clearPasswordOnError: false,
    showPasswordStrength: false,
    allowPasswordToggle: true,
  },
  
  // Loading states
  loading: {
    showSpinner: true,
    minDisplayTime: 500, // ms
    blockNavigation: true,
  },
  
  // Redirects
  redirects: {
    afterSignIn: '/dashboard',
    afterSignUp: '/dashboard',
    afterSignOut: '/',
    afterLinkProvider: '/settings',
    onAuthRequired: '/signin',
  },
  
  // Error handling
  errors: {
    showDetailedErrors: process.env.NODE_ENV === 'development',
    logToConsole: process.env.NODE_ENV === 'development',
    reportToSentry: process.env.NODE_ENV === 'production',
  },
} as const;

// Redis key patterns
export const REDIS_KEY_PATTERNS = {
  user: (bapId: string) => `user:${bapId}`,
  backup: (bapId: string) => `backup:${bapId}`,
  backupMetadata: (bapId: string) => `backup:${bapId}:metadata`,
  oauth: (provider: string, id: string) => `oauth:${provider}:${id}`,
  address: (address: string) => `addr:${address}`,
  bapProfile: (bapId: string) => `bap:${bapId}`,
  blockHeight: () => 'block:height',
  deviceLink: (token: string) => `device-link:${token}`,
  oauthState: (state: string) => `oauth-state:${state}`,
  pendingBackup: (bapId: string) => `pending-backup:${bapId}`,
  memberExport: (token: string) => `member-export:${token}`,
  tempImage: (key: string) => `temp-image:${key}`,
} as const;

// Development configuration
export const DEV_CONFIG = {
  // Local development settings
  localPort: process.env.PORT || 4100,
  useHttps: false,
  
  // Debug options
  logAuthTokens: false,
  logRedisOperations: false,
  bypassOAuthValidation: false,
  
  // Mock data
  useMockOAuth: false,
  mockOAuthDelay: 1000, // ms
} as const;

// Type exports for TypeScript support
export type OAuthProvider = typeof OAUTH_CONFIG.availableProviders[number];
export type BackupRequiredField = typeof BACKUP_CONFIG.requiredFields[number];
export type RedisKeyPattern = keyof typeof REDIS_KEY_PATTERNS;

// Helper function to get full configuration
export function getAuthConfig() {
  return {
    time: AUTH_TIME_CONFIG,
    password: PASSWORD_CONFIG,
    oauth: OAUTH_CONFIG,
    backup: BACKUP_CONFIG,
    api: API_ENDPOINTS,
    ui: AUTH_UI_CONFIG,
    redis: REDIS_KEY_PATTERNS,
    dev: DEV_CONFIG,
  };
}

// Environment-aware configuration getter
export function getConfigForEnvironment(key: string): unknown {
  const config = getAuthConfig();
  const keys = key.split('.');
  
  let value: unknown = config;
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  
  return value;
}