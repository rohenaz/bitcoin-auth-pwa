# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun dev          # Start development server with Turbopack
npm run dev      # Alternative with npm

# Production
bun build        # Build for production
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

### API Routes

- `/api/auth/[...nextauth]`: NextAuth handler with custom Bitcoin credentials provider
- `/api/backup`: GET encrypted backups by OAuth ID
- `/api/bap`: GET BAP profiles by address
- `/api/users`: User management endpoints

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