# OAuthProviders

OAuth provider selection component for linking cloud backup storage with popular providers like Google, GitHub, and Twitter.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add oauth-providers
```

## Usage

```tsx
import { OAuthProviders } from 'bigblocks';

export default function BackupSettings() {
  const handleProviderClick = (provider) => {
    console.log('Selected provider:', provider);
    // Initiate OAuth flow
  };

  return (
    <OAuthProviders
      onProviderClick={handleProviderClick}
      linkedProviders={['google']}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onProviderClick | `(provider: string) => void` | - | Callback when provider selected |
| linkedProviders | `string[]` | `[]` | Already linked provider IDs |
| loading | `string \| null` | `null` | Provider currently loading |
| disabled | `boolean` | `false` | Disable all providers |
| providers | `string[]` | `['google', 'github', 'twitter']` | Available providers |
| showLabels | `boolean` | `true` | Show provider names |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| className | `string` | - | Additional CSS classes |

## Features

- **Multiple Providers**: Google, GitHub, Twitter support
- **Link Status**: Shows which providers are linked
- **Loading States**: Individual provider loading
- **Flexible Layout**: Horizontal or vertical display
- **Custom Providers**: Configure available options
- **Accessibility**: Keyboard navigation support

## Examples

### Basic Usage

```tsx
<OAuthProviders 
  onProviderClick={(provider) => {
    window.location.href = `/api/auth/link-provider?provider=${provider}`;
  }}
/>
```

### With Linked Status

```tsx
const { data: linkedProviders } = useConnectedAccounts();

<OAuthProviders 
  linkedProviders={linkedProviders}
  onProviderClick={handleProviderClick}
/>
```

### Loading State

```tsx
const [loadingProvider, setLoadingProvider] = useState(null);

<OAuthProviders 
  loading={loadingProvider}
  onProviderClick={async (provider) => {
    setLoadingProvider(provider);
    await linkProvider(provider);
    setLoadingProvider(null);
  }}
/>
```

### Vertical Layout

```tsx
<OAuthProviders 
  direction="vertical"
  showLabels={true}
  onProviderClick={handleProviderClick}
  className="w-full max-w-sm"
/>
```

### Custom Providers

```tsx
<OAuthProviders 
  providers={['google', 'github']} // Only show these two
  onProviderClick={handleProviderClick}
/>
```

### In Settings Page

```tsx
function SecuritySettings() {
  const { data: user } = useAuth();
  const linkedProviders = user?.connectedAccounts || [];

  return (
    <div>
      <h3>Cloud Backup Providers</h3>
      <p>Link providers to backup your wallet</p>
      <OAuthProviders 
        linkedProviders={linkedProviders}
        onProviderClick={(provider) => {
          if (linkedProviders.includes(provider)) {
            unlinkProvider(provider);
          } else {
            linkProvider(provider);
          }
        }}
      />
    </div>
  );
}
```

## Styling

Customize appearance with className:

```tsx
<OAuthProviders 
  className="gap-4 p-4 bg-gray-100 rounded-lg"
  onProviderClick={handleProviderClick}
/>
```

## Provider Configuration

Each provider requires OAuth app setup:

### Google
- Create app at console.cloud.google.com
- Add redirect URI: `/api/auth/callback/google`

### GitHub  
- Create app at github.com/settings/developers
- Add redirect URI: `/api/auth/callback/github`

### Twitter
- Create app at developer.twitter.com
- Add redirect URI: `/api/auth/callback/twitter`

## Related Components

- [SignupFlow](/components/signup-flow) - Uses during signup
- [LoginForm](/components/login-form) - OAuth restore option
- [OAuthRestoreFlow](/components/oauth-restore-flow) - Restore from OAuth