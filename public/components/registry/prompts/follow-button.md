# FollowButton

Follow and unfollow users on-chain using the bSocial protocol.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add follow-button
```

## Usage

```tsx
import { FollowButton } from 'bigblocks';

export default function UserProfile({ userId }) {
  return (
    <FollowButton
      userId={userId}
      onFollow={() => {
        console.log('User followed!');
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| userId | `string` | - | User ID to follow |
| onFollow | `() => void` | - | Callback after following |
| onUnfollow | `() => void` | - | Callback after unfollowing |
| onError | `(error: Error) => void` | - | Error callback |
| isFollowing | `boolean` | `false` | Current follow status |
| variant | `'default' \| 'outline' \| 'ghost'` | `'default'` | Button variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| showIcon | `boolean` | `true` | Show follow icon |
| followText | `string` | `'Follow'` | Follow button text |
| followingText | `string` | `'Following'` | Following button text |
| disabled | `boolean` | `false` | Disable button |
| className | `string` | - | Additional CSS classes |

## Features

- **On-chain Following**: Permanent follow records
- **Toggle Support**: Follow and unfollow
- **Status Indication**: Visual follow state
- **Hover Effects**: "Unfollow" on hover
- **Loading States**: Transaction feedback
- **Batch Operations**: Follow multiple users

## Examples

### Basic Follow

```tsx
<FollowButton
  userId="user123"
  onFollow={() => {
    // Update UI
    refetchProfile();
  }}
/>
```

### With Follow Status

```tsx
const [isFollowing, setIsFollowing] = useState(false);

<FollowButton
  userId={userId}
  isFollowing={isFollowing}
  onFollow={() => setIsFollowing(true)}
  onUnfollow={() => setIsFollowing(false)}
/>
```

### Different Variants

```tsx
// Default (filled)
<FollowButton variant="default" userId={userId} onFollow={handleFollow} />

// Outline
<FollowButton variant="outline" userId={userId} onFollow={handleFollow} />

// Ghost
<FollowButton variant="ghost" userId={userId} onFollow={handleFollow} />
```

### Custom Text

```tsx
<FollowButton
  userId={userId}
  followText="Subscribe"
  followingText="Subscribed"
  onFollow={handleFollow}
/>
```

### Without Icon

```tsx
<FollowButton
  userId={userId}
  showIcon={false}
  onFollow={handleFollow}
/>
```

### Different Sizes

```tsx
// Small
<FollowButton size="sm" userId={userId} onFollow={handleFollow} />

// Medium (default)
<FollowButton size="md" userId={userId} onFollow={handleFollow} />

// Large
<FollowButton size="lg" userId={userId} onFollow={handleFollow} />
```

### With Error Handling

```tsx
<FollowButton
  userId={userId}
  onFollow={handleFollow}
  onError={(error) => {
    if (error.code === 'SELF_FOLLOW') {
      toast.error('You cannot follow yourself');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      toast.error('Not enough BSV for transaction');
    } else {
      toast.error('Failed to follow user');
    }
  }}
/>
```

### In Profile Card

```tsx
function ProfileCard({ user }) {
  const { isFollowing, toggleFollow } = useFollowing(user.id);
  
  return (
    <div className="border rounded-lg p-6">
      <img src={user.avatar} className="w-20 h-20 rounded-full" />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
      
      <FollowButton
        userId={user.id}
        isFollowing={isFollowing}
        onFollow={toggleFollow}
        onUnfollow={toggleFollow}
        className="mt-4"
      />
    </div>
  );
}
```

### Batch Following

```tsx
function SuggestedUsers({ suggestions }) {
  return (
    <div className="space-y-4">
      {suggestions.map(user => (
        <div key={user.id} className="flex items-center justify-between">
          <UserInfo user={user} />
          <FollowButton
            userId={user.id}
            size="sm"
            onFollow={() => {
              analytics.track('user_followed', {
                source: 'suggestions'
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}
```

## Follow States

1. **Not Following**: Shows "Follow" button
2. **Following**: Shows "Following" button
3. **Hover on Following**: Shows "Unfollow"
4. **Loading**: Shows spinner during transaction

## Funding Requirements

- Follow action requires BSV fee
- Unfollow also requires fee
- Fees cover blockchain storage

## Styling

```tsx
<FollowButton
  userId={userId}
  className="rounded-full px-6"
  onFollow={handleFollow}
/>
```

## Integration

Works with social hooks:

```tsx
import { useUser, FollowButton } from 'bigblocks';

function UserProfile({ userId }) {
  const { user, followUser } = useUser(userId);
  
  return (
    <FollowButton
      userId={userId}
      isFollowing={user.isFollowedByMe}
      onFollow={() => followUser()}
    />
  );
}
```

## Related Components

- [ProfileCard](/components/profile-card) - User profiles
- [PostButton](/components/post-button) - Create posts
- [LikeButton](/components/like-button) - Like content
- [SocialFeed](/components/social-feed) - Following feed