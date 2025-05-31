# LikeButton

Add on-chain likes/reactions to social posts using the bSocial protocol.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add like-button
```

## Usage

```tsx
import { LikeButton } from 'bigblocks';

export default function PostActions({ postId }) {
  return (
    <LikeButton
      postId={postId}
      onLike={() => {
        console.log('Post liked!');
      }}
      likeCount={42}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| postId | `string` | - | ID of the post to like |
| onLike | `() => void` | - | Callback after liking |
| onUnlike | `() => void` | - | Callback after unliking |
| onError | `(error: Error) => void` | - | Error callback |
| isLiked | `boolean` | `false` | Current like status |
| likeCount | `number` | `0` | Number of likes |
| showCount | `boolean` | `true` | Show like count |
| variant | `'heart' \| 'thumbs' \| 'star'` | `'heart'` | Icon variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| animated | `boolean` | `true` | Enable animations |
| disabled | `boolean` | `false` | Disable button |
| className | `string` | - | Additional CSS classes |

## Features

- **On-chain Likes**: Permanent blockchain records
- **Toggle Support**: Like and unlike posts
- **Real-time Count**: Live like counter
- **Multiple Icons**: Heart, thumbs up, star
- **Animations**: Smooth like animations
- **Optimistic UI**: Instant visual feedback

## Examples

### Basic Like Button

```tsx
<LikeButton
  postId="post123"
  onLike={() => {
    // Update local state
    setLiked(true);
  }}
/>
```

### With Like Status

```tsx
const [isLiked, setIsLiked] = useState(false);
const [likeCount, setLikeCount] = useState(10);

<LikeButton
  postId={postId}
  isLiked={isLiked}
  likeCount={likeCount}
  onLike={() => {
    setIsLiked(true);
    setLikeCount(count => count + 1);
  }}
  onUnlike={() => {
    setIsLiked(false);
    setLikeCount(count => count - 1);
  }}
/>
```

### Different Variants

```tsx
// Heart (default)
<LikeButton variant="heart" postId={postId} onLike={handleLike} />

// Thumbs up
<LikeButton variant="thumbs" postId={postId} onLike={handleLike} />

// Star
<LikeButton variant="star" postId={postId} onLike={handleLike} />
```

### Without Count

```tsx
<LikeButton
  postId={postId}
  showCount={false}
  onLike={handleLike}
/>
```

### Different Sizes

```tsx
// Small
<LikeButton size="sm" postId={postId} onLike={handleLike} />

// Medium (default)
<LikeButton size="md" postId={postId} onLike={handleLike} />

// Large
<LikeButton size="lg" postId={postId} onLike={handleLike} />
```

### With Error Handling

```tsx
<LikeButton
  postId={postId}
  onLike={handleLike}
  onError={(error) => {
    if (error.code === 'ALREADY_LIKED') {
      toast.info('You already liked this post');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      toast.error('Not enough BSV for transaction fee');
    } else {
      toast.error('Failed to like post');
    }
  }}
/>
```

### In Post Component

```tsx
function PostCard({ post }) {
  const { isLiked, likeCount, toggleLike } = useLikes(post.id);
  
  return (
    <div className="border rounded-lg p-4">
      <p>{post.content}</p>
      <div className="flex items-center gap-4 mt-4">
        <LikeButton
          postId={post.id}
          isLiked={isLiked}
          likeCount={likeCount}
          onLike={toggleLike}
          onUnlike={toggleLike}
        />
        <CommentButton postId={post.id} />
        <ShareButton postId={post.id} />
      </div>
    </div>
  );
}
```

### Custom Styling

```tsx
<LikeButton
  postId={postId}
  className="hover:scale-110 transition-transform"
  onLike={handleLike}
/>
```

## Animation Effects

- Click animation: Scale and rotate
- Color transition: Gray to red/blue
- Count increment: Smooth number change
- Particle effects: Optional burst animation

## Funding Requirements

- Each like requires small BSV fee
- Unlike also requires fee
- Batch operations available

## Performance

- Optimistic updates for instant feedback
- Debounced blockchain writes
- Efficient re-render management

## Integration

Works with social hooks:

```tsx
import { useSocialPost, LikeButton } from 'bigblocks';

function Post({ postId }) {
  const { post, likePost } = useSocialPost(postId);
  
  return (
    <LikeButton
      postId={postId}
      isLiked={post.isLikedByMe}
      likeCount={post.likeCount}
      onLike={() => likePost()}
    />
  );
}
```

## Related Components

- [PostButton](/components/post-button) - Create posts
- [FollowButton](/components/follow-button) - Follow users
- [PostCard](/components/post-card) - Display posts
- [MessageDisplay](/components/message-display) - Show reactions