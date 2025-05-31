# ProfileCard

Display user profile information in a card format with avatar, name, bio, and action buttons.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add profile-card
```

## Usage

```tsx
import { ProfileCard } from 'bigblocks';

export default function UserProfile() {
  const profile = {
    name: 'Satoshi Nakamoto',
    bio: 'Creator of Bitcoin',
    avatar: '/avatar.jpg',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  };

  return (
    <ProfileCard 
      profile={profile}
      onEdit={() => console.log('Edit profile')}
      onShare={() => console.log('Share profile')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| profile | `Profile` | - | User profile data |
| onEdit | `() => void` | - | Edit button callback |
| onShare | `() => void` | - | Share button callback |
| onFollow | `() => void` | - | Follow button callback |
| isFollowing | `boolean` | `false` | Following status |
| showActions | `boolean` | `true` | Show action buttons |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size variant |
| className | `string` | - | Additional CSS classes |

## Profile Object

```typescript
interface Profile {
  name: string;
  bio?: string;
  avatar?: string;
  address: string;
  verified?: boolean;
  stats?: {
    posts?: number;
    followers?: number;
    following?: number;
  };
}
```

## Examples

### Basic Profile

```tsx
<ProfileCard 
  profile={{
    name: 'Alice',
    bio: 'Bitcoin enthusiast',
    address: '1A1zP1...'
  }}
/>
```

### With Actions

```tsx
<ProfileCard 
  profile={profile}
  onEdit={handleEdit}
  onShare={handleShare}
  onFollow={handleFollow}
  isFollowing={false}
/>
```

### Different Sizes

```tsx
// Small
<ProfileCard profile={profile} size="sm" />

// Medium (default)
<ProfileCard profile={profile} size="md" />

// Large
<ProfileCard profile={profile} size="lg" />
```

### With Stats

```tsx
<ProfileCard 
  profile={{
    name: 'Bob',
    bio: 'Developer',
    address: '1A1zP1...',
    stats: {
      posts: 42,
      followers: 1337,
      following: 21
    }
  }}
/>
```

### Verified Profile

```tsx
<ProfileCard 
  profile={{
    name: 'Charlie',
    bio: 'Verified user',
    address: '1A1zP1...',
    verified: true
  }}
/>
```

### Without Actions

```tsx
<ProfileCard 
  profile={profile}
  showActions={false}
/>
```

### In Profile List

```tsx
function ProfileList({ profiles }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map(profile => (
        <ProfileCard 
          key={profile.address}
          profile={profile}
          size="sm"
          onEdit={() => editProfile(profile.address)}
        />
      ))}
    </div>
  );
}
```

## Styling

Customize with className:

```tsx
<ProfileCard 
  profile={profile}
  className="shadow-lg hover:shadow-xl transition-shadow"
/>
```

## Integration

Works with profile management hooks:

```tsx
import { useProfile, ProfileCard } from 'bigblocks';

function MyProfile() {
  const { profile, updateProfile } = useProfile();
  
  return (
    <ProfileCard 
      profile={profile}
      onEdit={() => {
        // Open edit modal
      }}
    />
  );
}
```

## Related Components

- [ProfileEditor](/components/profile-editor) - Edit profiles
- [ProfileViewer](/components/profile-viewer) - Detailed view
- [ProfileSwitcher](/components/profile-switcher) - Switch profiles
- [ProfilePopover](/components/profile-popover) - Preview on hover