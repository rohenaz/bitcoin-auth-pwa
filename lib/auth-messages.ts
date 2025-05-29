/**
 * Centralized authentication messages and strings configuration
 * This allows for easy customization, internationalization, and branding
 */

export const AUTH_MESSAGES = {
  // Error messages
  errors: {
    // Authentication errors
    noAuthToken: 'No auth token provided',
    invalidAuthToken: 'Invalid auth token format',
    tokenVerificationFailed: 'Token verification failed',
    authenticationFailed: 'Authentication failed',
    unauthorized: 'Unauthorized',
    notAuthenticated: 'Not authenticated',
    sessionExpired: 'Session expired',
    addressMismatch: 'Address does not match auth token',
    
    // Backup and storage errors
    noBackup: 'No local backup found',
    noBackupForOAuth: 'No backup found for OAuth account',
    noBackupForAccount: 'No backup found for this account',
    invalidBackupFormat: 'Invalid backup format',
    invalidBackupFile: 'Invalid backup file. Please select a valid backup (encrypted or decrypted).',
    backupDataNotFound: 'No backup data found',
    
    // Password errors
    incorrectPassword: 'Incorrect password. Please try again.',
    invalidPassword: 'Invalid password',
    invalidPasswordOrCorrupted: 'Invalid password or corrupted backup',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    
    // User and profile errors
    userNotFound: 'User not found',
    userAlreadyExists: 'User already exists',
    profileNotFound: 'Profile not found',
    cannotVerifyOwnership: 'Cannot verify profile ownership',
    unauthorizedProfileUpdate: 'Unauthorized to update this profile',
    
    // OAuth errors
    oauthAlreadyLinked: 'This OAuth account is already linked to another Bitcoin identity',
    oauthAccountAlreadyLinked: 'OAuth account already linked',
    cannotDisconnectCurrent: 'Cannot disconnect the provider you are currently signed in with',
    noOAuthInfo: 'No OAuth provider information found',
    invalidOAuthSession: 'Invalid OAuth session format.',
    notSignedInWithOAuth: 'Not signed in with OAuth provider.',
    invalidOAuthProvider: 'Invalid OAuth provider specified.',
    oauthStateFailed: 'OAuth state validation failed. Please try again.',
    oauthDenied: 'OAuth authorization was denied.',
    oauthProviderNotConfigured: 'This OAuth provider is not configured. Please check environment variables.',
    oauthProviderDisabled: 'This OAuth provider is temporarily disabled.',
    
    // Validation errors
    missingRequiredFields: 'Missing required fields',
    invalidAlternateName: 'Invalid alternateName',
    missingProfileIdentifiers: 'Missing profile identifiers',
    tokenRequired: 'Token required',
    invalidOrExpiredToken: 'Invalid or expired token',
    bapIdOrOAuthRequired: 'bapid or oauthId required',
    encryptedBackupRequired: 'encryptedBackup required',
    noBapIdFound: 'No BAP ID found',
    bapIdAndAddressRequired: 'BAP ID and address are required',
    providerRequired: 'Provider is required',
    invalidOAuthIdFormat: 'Invalid oauthId format',
    
    // Identity errors
    identityVerificationFailed: 'Identity verification failed',
    identityMismatch: 'Identity mismatch',
    unauthorizedTransfer: 'Unauthorized to transfer to this account',
    noIdentityInBackup: 'No identity found in backup',
    
    // General operation errors
    failedToCreateUser: 'Failed to create user',
    failedToStoreBackup: 'Failed to store backup',
    failedToUpdateProfile: 'Failed to update profile',
    failedToFetchProfile: 'Failed to fetch profile',
    failedToCreateProfile: 'Failed to create profile',
    failedToGenerateKeys: 'Failed to generate new identity keys',
    failedToValidateToken: 'Failed to validate token',
    failedToGenerateLink: 'Failed to generate link',
    failedToGenerateExportToken: 'Failed to generate export token',
    failedToFetchAccounts: 'Failed to fetch connected accounts',
    failedToDisconnectAccount: 'Failed to disconnect account',
    failedToTransferOAuth: 'Failed to transfer OAuth link',
    failedToRetrieveBackup: 'Failed to retrieve your backup. Please try again.',
    failedToLinkAccount: 'Failed to link account',
    failedToDecryptBackup: 'Failed to decrypt backup',
    failedToEncryptWallet: 'Failed to encrypt wallet',
    failedToCompleteImport: 'Failed to complete import',
    failedToProcessBackup: 'Failed to process backup. Please try again.',
    failedToLogin: 'Failed to login',
    
    // Session errors
    mustBeSignedInWithBitcoin: 'You must be signed in with your Bitcoin credentials to link OAuth providers.',
    incompleteSession: 'Unauthorized or incomplete session',
    missingOAuthParams: 'Missing required OAuth parameters.',
    noTokenProvided: 'No token provided',
  },
  
  // Success messages
  success: {
    userCreated: 'User created successfully',
    backupStored: 'Backup stored successfully',
    profileUpdated: 'Profile updated successfully',
    accountLinked: 'Account linked successfully',
    accountDisconnected: 'Account disconnected successfully',
    oauthTransferred: 'Successfully transferred {provider} link',
  },
  
  // Validation messages
  validation: {
    passwordRequirements: 'Minimum 8 characters. This encrypts your Bitcoin keys.',
    passwordNoRecovery: 'This password cannot be recovered. If you forget it, you\'ll lose access to your Bitcoin identity.',
    downloadBackupFirst: 'Please download your master backup before continuing',
  },
  
  // Page titles and headings
  titles: {
    // Sign in
    welcomeBack: 'Welcome Back',
    setYourPassword: 'Set Your Password',
    confirmYourPassword: 'Confirm Your Password',
    restoreYourWallet: 'Restore Your Wallet',
    linkThisDevice: 'Link This Device',
    
    // Sign up
    welcomeToBitcoinAuth: 'Welcome to Bitcoin Auth',
    createYourIdentity: 'Create Your Identity',
    secureYourIdentity: 'Secure Your Identity',
    identityGenerated: 'Identity Generated!',
    identityImported: 'Identity Imported!',
    secureYourBackup: 'Secure Your Backup',
    
    // Settings
    accountOverview: 'Account Overview',
    backupAnchors: 'Backup Anchors',
    securitySettings: 'Security Settings',
    dangerZone: 'Danger Zone',
    
    // Modals
    editProfile: 'Edit Profile',
    oauthConflict: '{provider} Account Already Linked',
    noBackupFound: 'No Backup Found',
    linkFailed: 'Link Failed',
    authenticationRequired: 'Authentication Required',
    accessDenied: 'Access Denied',
  },
  
  // Subtitles and descriptions
  subtitles: {
    enterPasswordToDecrypt: 'Enter your password to decrypt your wallet',
    signInWithLinked: 'Sign in with your linked account',
    createPasswordToEncrypt: 'Create a password to encrypt your imported wallet',
    enterPasswordAgain: 'Enter your password again to confirm',
    foundBackupEnterPassword: 'We found your backup. Enter your password to decrypt it.',
    createSelfSovereignIdentity: 'Create your self-sovereign identity with Bitcoin',
    nowSecureWithPassword: 'Now let\'s secure it with a password',
    linkCloudProviders: 'Link cloud providers to enable multi-device access',
    enterPasswordToAccess: 'Enter your password to access your Bitcoin identity on this device',
    oauthProvidersDescription: 'OAuth providers used to store your encrypted backup across devices. Link multiple providers for redundancy.',
    dangerZoneWarning: 'These actions are permanent and cannot be undone.',
    accountLinkingComingSoon: 'We found an existing account with your email. Account linking coming soon.',
    redirectingToAccountCreation: 'Redirecting to account creation...',
    validatingDeviceLink: 'Validating device link...',
    linkingToBapId: 'Linking to BAP ID:',
    pleaseSignInToAccess: 'Please sign in to access settings',
    manageEncryptionAndBackup: 'Manage encryption and backup security',
    publishingComingSoon: 'Publishing to blockchain coming soon',
  },
  
  // Labels
  labels: {
    password: 'Password',
    createPassword: 'Create Password',
    confirmPassword: 'Confirm Password',
    encryptionPassword: 'Encryption Password',
    passwordForOtherAccount: 'Password for Other Account',
    displayName: 'Display Name',
    profileImageUrl: 'Profile Image URL',
    bio: 'Bio',
    signingAddress: 'Signing Address',
    bapIdentityKey: 'BAP Identity Key',
    sessionProvider: 'Session Provider',
    recoveryPhrase: 'Recovery Phrase',
    masterBackup: 'Master Backup',
    backupImport: 'Or import your existing backup',
    importBackupFile: 'Import Backup File',
    backupSupport: 'Supports both encrypted and decrypted backups',
  },
  
  // Placeholders
  placeholders: {
    enterPassword: 'Enter your password',
    createStrongPassword: 'Create a strong password',
    reEnterPassword: 'Re-enter your password',
    enterDisplayName: 'Enter your display name',
    profileImageUrl: 'https://example.com/image.jpg',
    tellAboutYourself: 'Tell us about yourself...',
  },
  
  // Button labels
  buttons: {
    // Primary actions
    signIn: 'Sign In',
    signUp: 'Sign Up',
    continue: 'Continue',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    
    // Auth actions
    unlockWallet: 'Unlock Wallet',
    decryptAndSignIn: 'Decrypt & Sign In',
    linkDeviceAndSignIn: 'Link Device & Sign In',
    createAccount: 'Create Account',
    generateNewIdentity: 'Generate New Bitcoin Identity',
    importExistingIdentity: 'Import Existing Identity',
    
    // Loading states
    unlocking: 'Unlocking...',
    decrypting: 'Decrypting...',
    generating: 'Generating...',
    saving: 'Saving...',
    importing: 'Importing...',
    transferring: 'Transferring...',
    disconnecting: 'Disconnecting...',
    completeImport: 'Complete Import',
    completeSetup: 'Complete Setup',
    creatingWallet: 'Creating wallet...',
    
    // Link actions
    connect: 'Connect',
    disconnect: 'Disconnect',
    connected: 'Connected',
    notConnected: 'Not connected',
    linkAccount: 'Link Account',
    linkAnAccount: 'Link an Account to Continue',
    transferLink: 'Transfer Link',
    transferProvider: 'Transfer {provider} Link',
    useExistingAccount: 'Use Existing Account',
    
    // Navigation
    continueToDashboard: 'Continue to Dashboard',
    goToSignIn: 'Go to Sign In',
    skipForNow: 'Skip for now (not recommended)',
    tryDifferentAccount: 'Try a different account',
    useLocalBackup: 'Use local backup instead',
    switchingAccount: 'Switching to your existing account...',
    
    // File actions
    download: 'Download',
    import: 'Import',
    importBackupFile: 'Import Backup File',
    
    // Settings
    signOut: 'Sign Out',
    publishToBlockchain: 'Publish to Blockchain',
  },
  
  // Feature descriptions
  features: {
    generateBitcoinKeys: 'Generate Bitcoin Keys',
    generateBitcoinKeysDesc: 'We\'ll create a unique Bitcoin identity that only you control',
    createPasswordTitle: 'Create Password',
    createPasswordDesc: 'Encrypt your keys with a strong password',
    linkCloudBackup: 'Link Cloud Backup',
    linkCloudBackupDesc: 'Store encrypted backup for multi-device access',
    whyLinkMultiple: 'Why link multiple accounts?',
    accessFromAnyDevice: 'Access your identity from any device',
    redundantBackups: 'Redundant backups across providers',
    neverLoseAccess: 'Never lose access to your Bitcoin identity',
    recoveryPhraseWarning: 'Write down these words in order. This is the ONLY way to recover your master identity if you lose your password.',
    masterBackupDesc: 'Download your encrypted master backup. This file contains your complete identity.',
    importBackupSupport: 'Supports both encrypted and decrypted backups',
  },
  
  // Navigation and links
  navigation: {
    needNewIdentity: 'Need a new identity?',
    alreadyHaveAccount: 'Already have an account?',
    orImportBackup: 'Or import your existing backup',
  },
  
  // Modal specific messages
  modals: {
    oauthConflictDesc: 'This {provider} account is already linked to another Bitcoin identity. You have two options:',
    transferOAuthDesc: 'Move the {provider} connection from your other account to this one (requires password for the other account)',
    useExistingDesc: 'Discard this new identity and continue with your existing account',
    enterPasswordToTransfer: 'Enter the password for your other account to verify ownership and transfer the {provider} link to your current account.',
  },
  
  // Time-related
  time: {
    authTokenValidity: '10 minutes',
    deviceLinkExpiry: '10 minutes',
    oauthStateExpiry: '10 minutes',
  },
  
  // Provider names
  providers: {
    google: 'Google',
    github: 'GitHub',
    twitter: 'X (Twitter)',
  },
} as const;

// Type helper for accessing nested messages
export type AuthMessageKey = keyof typeof AUTH_MESSAGES;
export type AuthMessageSubKey<K extends AuthMessageKey> = keyof typeof AUTH_MESSAGES[K];

// Helper function to get message with optional interpolation
export function getMessage(
  category: AuthMessageKey,
  key: string,
  replacements?: Record<string, string>
): string {
  const categoryMessages = AUTH_MESSAGES[category];
  const message = (categoryMessages as Record<string, string>)[key];
  
  if (!message) {
    console.warn(`Message not found: ${category}.${key}`);
    return key;
  }
  
  if (!replacements) {
    return message;
  }
  
  // Replace placeholders like {provider} with actual values
  return Object.entries(replacements).reduce(
    (msg, [key, value]) => msg.replace(new RegExp(`{${key}}`, 'g'), value),
    message
  );
}