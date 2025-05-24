# Bitcoin Authentication Next.js Template

A modern, minimalist Progressive Web App template for Bitcoin-based authentication. This template provides a complete authentication flow using Bitcoin keypairs as the primary identity, with encrypted cloud backup via OAuth providers.

## 🚀 What This Template Provides

- **Self-sovereign identity**: Users own their identity through Bitcoin keypairs
- **Client-side encryption**: Private keys never leave the browser unencrypted
- **Multi-device sync**: Encrypted backups stored in cloud via OAuth anchoring
- **Beautiful dark UI**: Mobile-first, minimalist design with dark mode
- **Zero passwords transmitted**: Authentication via cryptographic signatures
- **BAP integration**: Bitcoin Attestation Protocol for rich identity profiles

## 🔑 Core Concept

Unlike traditional authentication systems, this template uses Bitcoin keypairs as the fundamental identity primitive. Your private key (WIF) IS your identity - there are no usernames, emails, or passwords stored on servers. 

OAuth providers (Google, GitHub, X) are used solely as "anchors" to store and retrieve your encrypted backup across devices - they are NOT the primary authentication method.

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (Client-side)  │
├─────────────────┤
│ • Key Generation│
│ • Encryption    │
│ • Signing       │
│ • Decryption    │
└────────┬────────┘
         │
         │ X-Auth-Token
         │ (Signed requests)
         ▼
┌─────────────────┐
│   Backend       │
│  (Next.js API)  │
├─────────────────┤
│ • Verify sigs   │
│ • BAP lookup    │
│ • Session mgmt  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Storage       │
│  (Redis)        │
├─────────────────┤
│ • User profiles │
│ • BAP data      │
│ • Encrypted     │
│   backups       │
└─────────────────┘
```

## 🔐 Security Model

1. **Private keys are generated client-side** and never transmitted
2. **Password encryption happens in the browser** before any storage
3. **OAuth providers only store encrypted data** - they cannot access your keys
4. **Every API request is authenticated** with a Bitcoin signature
5. **Time-bound tokens** prevent replay attacks (10-minute window)

## 📱 User Flow

### New User Flow
1. User clicks "Get Started" on landing page
2. System generates Bitcoin keypair in browser
3. User creates encryption password
4. Private key is encrypted with password
5. User links OAuth provider (Google/GitHub/X)
6. Encrypted backup stored in cloud, keyed by OAuth ID
7. User lands on dashboard showing their profile

### Returning User Flow (Same Device)
1. User clicks "Login"
2. Decrypts local backup with password
3. Private key restored to session storage
4. Authenticated requests signed with private key

### Returning User Flow (New Device)
1. User signs in with linked OAuth provider
2. Encrypted backup retrieved from cloud
3. User enters encryption password
4. Private key decrypted locally
5. Can now make authenticated requests

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Vercel account (for deployment and automatic Redis provisioning)
- OAuth app credentials (Google, GitHub, and/or X)

### Quick Start

#### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frohenaz%2Fbitcoin-auth-pwa&env=AUTH_SECRET&envDescription=Required%20environment%20variables&envLink=https%3A%2F%2Fgithub.com%2Frohenaz%2Fbitcoin-auth-pwa%23environment-variables&stores=%5B%7B%22type%22%3A%22kv%22%7D%5D)

1. Click the deploy button above
2. Vercel will automatically provision a KV (Redis) store
3. Set up your OAuth apps and add credentials in Vercel dashboard

#### Local Development

```bash
# Clone the template
git clone https://github.com/rohenaz/bitcoin-auth-pwa.git
cd bitcoin-auth-pwa

# Install dependencies
bun install

# Pull environment variables from Vercel
vercel env pull .env.local

# Run development server
bun dev
```

### Environment Variables

When deploying to Vercel, the KV store is automatically provisioned. For OAuth providers, add these in your Vercel dashboard:

```env
# Core (Vercel provides KV_* automatically)
AUTH_SECRET=<generate with: openssl rand -base64 32>

# OAuth Providers (all optional, add as needed)
AUTH_GITHUB_ID=your-github-oauth-app-id
AUTH_GITHUB_SECRET=your-github-oauth-app-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret

# Optional: BAP API
BAP_API_URL=https://sigmaidentity.com/api
```

## 📁 Project Structure

```
bitcoin-auth-pwa/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── signin/          # Login flow
│   │   ├── signup/          # Registration flow
│   │   └── success/         # Post-auth success
│   ├── api/
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── backup/          # Encrypted backup management
│   │   ├── bap/             # BAP profile resolution
│   │   └── users/           # User management
│   ├── dashboard/           # Protected user dashboard
│   └── settings/            # Account settings
├── lib/
│   ├── auth.ts              # NextAuth + Bitcoin auth config
│   ├── backup.ts            # Encryption/decryption utilities
│   ├── bap.ts               # BAP integration
│   └── redis.ts             # Redis client setup
└── types/
    └── bap.ts               # TypeScript definitions
```

## 🎨 UI Components

The template includes a minimal, mobile-first dark theme UI with:

- **Landing page** with hero section
- **Unified auth flow** (detects new vs returning users)
- **OAuth provider selection** screen
- **Password entry** for encryption/decryption
- **Dashboard** showing user profile from BAP
- **Settings** for managing linked accounts
- **Responsive header** with session-aware navigation

## 🔧 Customization Guide

### Styling
- Edit `app/globals.css` for theme customization
- Primary highlight color is defined as CSS variable
- Uses Tailwind CSS for utility classes

### Authentication Providers
- Add/remove OAuth providers in `lib/auth.ts`
- Configure provider credentials in `.env.local`

### BAP Integration
- Customize identity schema in `lib/bap.ts`
- Modify profile display in dashboard components

### Storage
- Default uses Upstash Redis (serverless)
- Can be swapped for local Redis or other adapters

## 📦 Key Dependencies

- **[bitcoin-auth](https://github.com/b-open-io/bitcoin-auth)** - Bitcoin signature authentication
- **[bitcoin-backup](https://github.com/b-open-io/bitcoin-backup)** - Encrypted backup format
- **[bsv-bap](https://github.com/bitcoin-sv/bap)** - Bitcoin Attestation Protocol
- **[@bsv/sdk](https://github.com/bitcoin-sv/bsv-sdk)** - Bitcoin cryptographic operations
- **[next-auth](https://next-auth.js.org/)** - Authentication framework
- **[@upstash/redis](https://github.com/upstash/upstash-redis)** - Serverless Redis client

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Railway
```bash
railway up
```

### Self-hosted
```bash
bun run build
bun start
```

## 🔍 How It Works: Technical Deep Dive

### Bitcoin Key Generation
```typescript
// Client-side only
const privateKey = PrivateKey.fromRandom();
const wif = privateKey.toWif();
const publicKey = privateKey.toPublicKey().toString();
```

### Password Encryption
```typescript
// Uses bitcoin-backup format
const encrypted = await encrypt({
  data: { wif: privateKeyWif },
  password: userPassword,
  iterations: 100000 // Configurable
});
```

### Authentication Token
```typescript
// Every authenticated request includes
headers: {
  'X-Auth-Token': getAuthToken({
    privateKeyWif,
    requestPath: '/api/protected',
    body: JSON.stringify(data)
  })
}
```

### OAuth Anchoring
```typescript
// OAuth ID serves as the storage key
const oauthId = 'google-oauth2|123456789';
await redis.set(`backup:${oauthId}`, encryptedBackup);
```

## 🛡️ Security Considerations

1. **Never expose private keys**: All key operations happen client-side
2. **Strong passwords**: Encourage users to use strong encryption passwords
3. **HTTPS only**: Always deploy with TLS in production
4. **Time windows**: Authentication tokens expire after 10 minutes
5. **No key recovery**: Lost passwords mean lost accounts (by design)

## 🤝 Contributing

This is a template repository. To contribute:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this template for any project

## 🙏 Acknowledgments

- Bitcoin SV ecosystem for identity protocols
- NextAuth.js team for the authentication framework
- Upstash for serverless Redis infrastructure

## 🎯 Use Cases

This template is perfect for:
- Decentralized social platforms
- Personal data vaults
- Blockchain-based applications
- Privacy-focused services
- Self-sovereign identity systems

---

Built with ❤️ for the decentralized web