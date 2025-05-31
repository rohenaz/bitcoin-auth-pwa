# ProfileEditor

Edit user profile information with real-time validation and preview.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add profile-editor
```

## Usage

```tsx
import { ProfileEditor } from 'bigblocks';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: 'Satoshi',
    bio: 'Bitcoin creator',
    avatar: '/avatar.jpg'
  });

  const handleSave = async (updatedProfile) => {
    console.log('Saving profile:', updatedProfile);
    // Save to backend
  };

  return (
    <ProfileEditor
      profile={profile}
      onSave={handleSave}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| profile | `Profile` | - | Current profile data |
| onSave | `(profile: Profile) => Promise<void>` | - | Save callback |
| onCancel | `() => void` | - | Cancel callback |
| onChange | `(profile: Profile) => void` | - | Change callback |
| showPreview | `boolean` | `true` | Show live preview |
| maxBioLength | `number` | `160` | Bio character limit |
| allowAvatarUpload | `boolean` | `true` | Enable avatar upload |
| loading | `boolean` | `false` | Loading state |
| className | `string` | - | Additional CSS classes |

## Features

- **Live Preview**: See changes in real-time
- **Avatar Upload**: Drag & drop or click to upload
- **Character Counter**: Bio length validation
- **Form Validation**: Required field checks
- **Auto-save**: Optional auto-save mode
- **Responsive Layout**: Works on all devices

## Examples

### Basic Editor

```tsx
<ProfileEditor
  profile={currentProfile}
  onSave={async (profile) => {
    await updateProfile(profile);
    toast.success('Profile updated!');
  }}
/>
```

### Without Preview

```tsx
<ProfileEditor
  profile={profile}
  showPreview={false}
  onSave={handleSave}
/>
```

### Custom Bio Length

```tsx
<ProfileEditor
  profile={profile}
  maxBioLength={280} // Twitter-style limit
  onSave={handleSave}
/>
```

### With Loading State

```tsx
const [saving, setSaving] = useState(false);

<ProfileEditor
  profile={profile}
  loading={saving}
  onSave={async (profile) => {
    setSaving(true);
    await saveProfile(profile);
    setSaving(false);
  }}
/>
```

### Auto-save Mode

```tsx
<ProfileEditor
  profile={profile}
  onChange={debounce(async (profile) => {
    await autoSaveProfile(profile);
  }, 1000)}
  onSave={handleSave}
/>
```

### In Modal

```tsx
function EditProfileModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ProfileEditor
        profile={currentProfile}
        onSave={async (profile) => {
          await updateProfile(profile);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}
```

### With Avatar Validation

```tsx
<ProfileEditor
  profile={profile}
  onSave={handleSave}
  allowAvatarUpload={true}
  onAvatarError={(error) => {
    if (error.code === 'FILE_TOO_LARGE') {
      toast.error('Image must be under 5MB');
    }
  }}
/>
```

## Avatar Upload

Supports multiple formats:
- JPEG/JPG
- PNG
- GIF
- WebP

Max file size: 5MB (configurable)

## Validation Rules

- Name: Required, 3-50 characters
- Bio: Optional, max length configurable
- Avatar: Optional, valid image format

## Styling

Customize appearance:

```tsx
<ProfileEditor
  profile={profile}
  className="bg-white dark:bg-gray-900 rounded-lg p-6"
  onSave={handleSave}
/>
```

## API Integration

```tsx
import { useProfile, ProfileEditor } from 'bigblocks';

function EditMyProfile() {
  const { profile, updateProfile } = useProfile();
  
  return (
    <ProfileEditor
      profile={profile}
      onSave={async (updatedProfile) => {
        await updateProfile(updatedProfile);
        router.push('/profile');
      }}
    />
  );
}
```

## Related Components

- [ProfileCard](/components/profile-card) - Display profiles
- [ProfileViewer](/components/profile-viewer) - View profiles
- [ProfilePublisher](/components/profile-publisher) - Publish on-chain