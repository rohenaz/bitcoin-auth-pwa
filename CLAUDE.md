# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun dev          # Start development server with Turbopack
npm run dev      # Alternative with npm

# Production
bun run build    # Build for production
bun start        # Start production server

# Code Quality
bun lint         # Run ESLint
npm run lint     # Alternative with npm
```

## Architecture Overview

This is a Bitcoin-based authentication PWA where users' Bitcoin keypairs ARE their identity. No traditional usernames/passwords.

### Authentication Flow

1. **New Users**: Generate BAP identity → Encrypt with password → Store locally → Link OAuth for cloud backup
2. **Returning Users (Same Device)**: Decrypt local backup with password → Use keys for auth
3. **Returning Users (New Device)**: OAuth login → Retrieve encrypted backup → Decrypt with password
4. **OAuth Provider Linking**: Special flow that bypasses NextAuth session creation:
   - Must be signed in with credentials provider (Bitcoin keys)
   - From Settings → `/api/auth/link-provider` → OAuth sign-in
   - Callback to `/api/auth/link-provider/callback` (NOT NextAuth callback)
   - Creates OAuth mapping without creating new session
   - Returns to existing credentials session with success/error params

### Key Architectural Decisions

- **BAP (Bitcoin Attestation Protocol)**: Used for hierarchical deterministic identity management. User identities are BAP master backups containing xprv and identity attributes.
- **Client-Side Encryption**: Private keys NEVER leave the browser unencrypted. All encryption happens client-side using `bitcoin-backup`.
- **OAuth as Storage**: OAuth providers (Google/GitHub/X) are used ONLY as "anchors" to store/retrieve encrypted backups, NOT for authentication.
- **Signature Authentication**: Every API request includes `X-Auth-Token` header with Bitcoin signature (using `bitcoin-auth` library).
- **Redis Storage**: User profiles, BAP data, and encrypted backups stored in Upstash Redis with structured keys.

### Critical Implementation Details

- **Session Storage**: Decrypted BAP backup stored in `sessionStorage` with key `decryptedBackup`
- **Local Storage**: Encrypted backup stored in `localStorage` with key `encryptedBackup`
- **BAP Identity Access**: Extract identity from backup using: `new BAP(backup.xprv)` → `bap.getId(ids[0])` → `exportMemberBackup()`
- **Time-Bound Tokens**: Authentication tokens have 10-minute validity window
- **Block Height Tracking**: BAP profiles tracked with block height for updates
- **JWT Session Strategy**: Uses JWT tokens, NOT database sessions (no adapter needed)
- **OAuth Mapping**: Links OAuth providers to BAP IDs via `oauth:{provider}:{providerAccountId}` → `bapId`
- **Address Mapping**: Maps Bitcoin addresses to BAP IDs for unpublished profiles via `addr:{address}` → `{id, block}`
- **OAuth State Management**: OAuth linking uses crypto-secure state stored in Redis with 10-minute expiry
- **Environment Validation**: Server-side only via `typeof window === 'undefined'` check
- **Enabled Providers**: Configured in `lib/env.ts` as `ENABLED_PROVIDERS` constant (currently google, github)

### API Routes

- `/api/auth/[...nextauth]`: NextAuth handler with custom Bitcoin credentials provider
- `/api/auth/link-provider`: GET initiates OAuth linking flow (bypasses NextAuth)
- `/api/auth/link-provider/callback`: GET handles OAuth callback for linking (creates mapping only)
- `/api/backup`: GET/POST encrypted backups (GET by OAuth ID or BAP ID, POST to store backup)
- `/api/backup/status`: GET backup status for current user
- `/api/bap`: GET cached BAP profiles from Redis by address (includes unpublished profiles)
- `/api/device-link/generate`: POST generates a time-limited QR code for device linking
- `/api/device-link/validate`: POST validates device link token and returns encrypted backup
- `/api/users`: GET all users
- `/api/users/connected-accounts`: GET linked OAuth providers for current user
- `/api/users/disconnect-account`: POST to unlink OAuth provider
- `/api/users/link-backup`: POST to link backup to OAuth provider
- `/api/users/create-from-backup`: POST to create user record from existing backup
- `/api/users/profile`: GET/PUT user profile data (alternateName, image, description)

### Environment Variables Required

```env
# Core (Vercel KV provides KV_* automatically)
AUTH_SECRET=your-generated-secret  # Generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000     # Only needed for local dev

# OAuth Providers (set up at provider's developer console)
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret

# Optional
BAP_API_URL=https://sigmaidentity.com/api
```

### Vercel KV Store

This template uses Vercel KV (Redis) which is automatically provisioned when deploying. The following env vars are provided by Vercel:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**IMPORTANT**: Upstash Redis (used by Vercel KV) automatically serializes/deserializes JSON:
- When storing objects with `redis.set()`, they are automatically JSON.stringify'd
- When retrieving with `redis.get()`, objects are automatically parsed
- DO NOT manually `JSON.parse()` data from Redis - it's already an object
- Use proper typing: `const data = await redis.get(key) as MyType`

### Redis Key Structure

- `user:{bapId}`: User data (address, idKey, createdAt)
- `backup:{bapId}`: Encrypted backup string
- `backup:{bapId}:metadata`: Backup metadata (lastUpdated, hash)
- `oauth:{provider}:{providerAccountId}`: OAuth to BAP ID mapping
- `addr:{address}`: Address to BAP ID mapping for unpublished profiles
- `bap:{bapId}`: Cached BAP profile data
- `block:height`: Current blockchain height for tracking

### Key UI Components

- **ProfileEditor**: Modal for editing user profile (alternateName, image, description)
- **Homepage**: Dark-themed landing page with animations and feature highlights
- **Dashboard**: User profile display with edit functionality and BAP profile integration
- **Settings**: OAuth provider management for multi-device backup access
- **Security Settings**: Cloud backup management and local backup export
- **DeviceLinkQR**: QR code generator for direct device-to-device linking without OAuth
- **LinkDevice**: Page that handles QR code scanning and password decryption for new devices

### Important Implementation Notes

- **OAuth Providers as "Dumb Storage"**: OAuth is NEVER used for authentication, only as key-value storage for encrypted backups
- **No Mixed Sessions**: A user can only be authenticated via credentials (Bitcoin) OR OAuth, never both simultaneously
- **OAuth Linking Requirements**: User MUST be signed in with credentials provider to link OAuth accounts
- **Error Page Workaround**: Custom OAuth linking flow avoids NextAuth error pages by handling callbacks separately
- **BAP ID as Primary Key**: All user data is keyed by BAP ID, which is derived from the Bitcoin identity
- **Signature Verification**: Uses `bitcoin-auth` library to verify signatures with configurable time windows
- **Profile Updates**: User profile changes update Redis immediately but don't modify the encrypted backup