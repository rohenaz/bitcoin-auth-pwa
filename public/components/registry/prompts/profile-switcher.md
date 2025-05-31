# ProfileSwitcher

Switch between multiple user profiles with a dropdown interface.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add profile-switcher
```

## Usage

```tsx
import { ProfileSwitcher } from 'bigblocks';

export default function Header() {
  const profiles = [
    { id: '1', name: 'Personal', avatar: '/avatar1.jpg' },
    { id: '2', name: 'Business', avatar: '/avatar2.jpg' }
  ];

  return (
    <ProfileSwitcher
      profiles={profiles}
      activeProfileId="1"
      onSwitch={(profileId) => {
        console.log('Switched to:', profileId);
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| profiles | `Profile[]` | - | List of available profiles |
| activeProfileId | `string` | - | Currently active profile ID |
| onSwitch | `(profileId: string) => void` | - | Profile switch callback |
| onCreateNew | `() => void` | - | Create new profile callback |
| showCreateOption | `boolean` | `true` | Show create new option |
| placement | `'bottom' \| 'top'` | `'bottom'` | Dropdown placement |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| className | `string` | - | Additional CSS classes |

## Profile Interface

```typescript
interface Profile {
  id: string;
  name: string;
  avatar?: string;
  address?: string;
  isPrimary?: boolean;
}
```

## Examples

### Basic Usage

```tsx
<ProfileSwitcher
  profiles={userProfiles}
  activeProfileId={currentProfileId}
  onSwitch={handleProfileSwitch}
/>
```

### Without Create Option

```tsx
<ProfileSwitcher
  profiles={profiles}
  activeProfileId={activeId}
  showCreateOption={false}
  onSwitch={switchProfile}
/>
```

### With Create Handler

```tsx
<ProfileSwitcher
  profiles={profiles}
  activeProfileId={activeId}
  onSwitch={switchProfile}
  onCreateNew={() => {
    router.push('/profiles/create');
  }}
/>
```

### Different Sizes

```tsx
// Small
<ProfileSwitcher size="sm" {...props} />

// Medium (default)
<ProfileSwitcher size="md" {...props} />

// Large
<ProfileSwitcher size="lg" {...props} />
```

### Top Placement

```tsx
<ProfileSwitcher
  profiles={profiles}
  activeProfileId={activeId}
  placement="top"
  onSwitch={switchProfile}
/>
```

### In Navigation

```tsx
function Navigation() {
  const { profiles, activeProfile, switchProfile } = useProfiles();
  
  return (
    <nav className="flex items-center justify-between">
      <Logo />
      <ProfileSwitcher
        profiles={profiles}
        activeProfileId={activeProfile.id}
        onSwitch={switchProfile}
        onCreateNew={() => setShowCreateModal(true)}
      />
    </nav>
  );
}
```

### With Profile Status

```tsx
<ProfileSwitcher
  profiles={profiles.map(p => ({
    ...p,
    badge: p.isPrimary ? 'Primary' : undefined
  }))}
  activeProfileId={activeId}
  onSwitch={switchProfile}
/>
```

### Custom Styling

```tsx
<ProfileSwitcher
  profiles={profiles}
  activeProfileId={activeId}
  className="border-2 border-orange-500"
  onSwitch={switchProfile}
/>
```

## Keyboard Navigation

- `Space/Enter`: Open dropdown
- `Arrow Up/Down`: Navigate options
- `Enter`: Select profile
- `Escape`: Close dropdown

## Integration

Works with profile management:

```tsx
import { useProfiles, ProfileSwitcher } from 'bigblocks';

function App() {
  const { 
    profiles, 
    activeProfileId, 
    switchProfile,
    createProfile 
  } = useProfiles();
  
  return (
    <ProfileSwitcher
      profiles={profiles}
      activeProfileId={activeProfileId}
      onSwitch={async (id) => {
        await switchProfile(id);
        // Refresh app data for new profile
      }}
      onCreateNew={async () => {
        const newProfile = await createProfile();
        await switchProfile(newProfile.id);
      }}
    />
  );
}
```

## Multi-Profile Features

- Each profile has separate wallet
- Independent settings per profile
- Quick switching without logout
- Profile-specific data isolation

## Related Components

- [ProfileCard](/components/profile-card) - Display profiles
- [ProfileEditor](/components/profile-editor) - Edit profiles
- [ProfileManager](/components/profile-manager) - Manage all profiles