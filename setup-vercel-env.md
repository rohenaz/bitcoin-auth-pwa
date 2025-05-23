# Setting up Vercel Environment Variables

## Required Environment Variables

Run these commands to add the required environment variables to your Vercel project:

### 1. AUTH_SECRET (Required)
```bash
# Add to all environments
vercel env add AUTH_SECRET
```
When prompted, use this generated value: `AOpNxGhM1xWjEpYL2c3w1Lv3SZ1K2pDpuMY6+ElXD4M=`
(Or generate your own with: `openssl rand -base64 32`)

### 2. OAuth Provider Credentials

You'll need to set up OAuth apps for each provider you want to use:

#### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set:
   - Application name: Bitcoin Auth PWA (or your app name)
   - Homepage URL: https://your-app.vercel.app
   - Authorization callback URL: https://your-app.vercel.app/api/auth/callback/github
4. After creating, copy the Client ID and Client Secret

```bash
vercel env add AUTH_GITHUB_ID
vercel env add AUTH_GITHUB_SECRET
```

#### Google OAuth
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID
3. Set:
   - Authorized JavaScript origins: https://your-app.vercel.app
   - Authorized redirect URIs: https://your-app.vercel.app/api/auth/callback/google
4. Copy the Client ID and Client Secret

```bash
vercel env add AUTH_GOOGLE_ID
vercel env add AUTH_GOOGLE_SECRET
```

#### Twitter/X OAuth
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new app or use existing
3. Set up OAuth 2.0
4. Add callback URL: https://your-app.vercel.app/api/auth/callback/twitter
5. Copy the Client ID and Client Secret

```bash
vercel env add AUTH_TWITTER_ID
vercel env add AUTH_TWITTER_SECRET
```

### 3. BAP API URL (Optional)
```bash
vercel env add BAP_API_URL
```
Default value: `https://sigmaidentity.com/api`

## Quick Setup Script

If you want to add all at once, you can use this pattern:

```bash
# Add AUTH_SECRET (use your generated secret)
echo "AOpNxGhM1xWjEpYL2c3w1Lv3SZ1K2pDpuMY6+ElXD4M=" | vercel env add AUTH_SECRET production preview development

# Add BAP_API_URL
echo "https://sigmaidentity.com/api" | vercel env add BAP_API_URL production preview development

# For OAuth providers, you'll need to add them interactively after setting up the apps
```

## Verify Environment Variables

After adding all variables, verify they're set:

```bash
vercel env ls
```

## Deploy to Development

Once all environment variables are set:

```bash
# Deploy to preview/development
vercel

# Or deploy to production
vercel --prod
```

## Local Development

For local development, create a `.env.local` file:

```env
AUTH_SECRET=your-generated-secret-here
BAP_API_URL=https://sigmaidentity.com/api

# Add your OAuth credentials here after setting them up
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret
```

Note: The KV_* variables are automatically injected by Vercel when running locally with `vercel dev`.