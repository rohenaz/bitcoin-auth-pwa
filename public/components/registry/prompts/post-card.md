# PostCard

Display individual social media posts with author info, content, and interaction buttons.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add post-card
```

## Usage

```tsx
import { PostCard } from 'bigblocks';

export default function Post() {
  const post = {
    id: '1',
    content: 'Just deployed my first Bitcoin app! 🚀',
    author: {
      name: 'Alice',
      address: '1A1zP1...',
      avatar: '/alice.jpg'
    },
    timestamp: Date.now() - 3600000,
    likes: 12,
    replies: 3
  };

  return (
    <PostCard
      post={post}
      onLike={() => console.log('Liked')}
      onReply={() => console.log('Reply')}
      onShare={() => console.log('Share')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| post | `Post` | - | Post data object |
| onLike | `() => void` | - | Like button callback |
| onReply | `() => void` | - | Reply button callback |
| onShare | `() => void` | - | Share button callback |
| onAuthorClick | `() => void` | - | Author click callback |
| isLiked | `boolean` | `false` | Current like status |
| showActions | `boolean` | `true` | Show action buttons |
| variant | `'default' \| 'compact' \| 'detailed'` | `'default'` | Display variant |
| showThread | `boolean` | `false` | Show reply thread |
| highlighted | `boolean` | `false` | Highlight post |
| className | `string` | - | Additional CSS classes |

## Post Interface

```typescript
interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    address: string;
    avatar?: string;
    verified?: boolean;
  };
  timestamp: number;
  txid?: string;
  likes?: number;
  replies?: number;
  reposts?: number;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  replyTo?: {
    id: string;
    author: string;
  };
}
```

## Features

- **Rich Content**: Text, images, videos
- **Author Info**: Avatar, name, verification
- **Timestamps**: Relative time display
- **Interactions**: Like, reply, share counts
- **Thread Support**: Reply conversations
- **Media Preview**: Image/video display

## Examples

### Basic Post

```tsx
<PostCard
  post={post}
  onLike={handleLike}
  onReply={handleReply}
/>
```

### With Like Status

```tsx
<PostCard
  post={post}
  isLiked={true}
  onLike={toggleLike}
  onReply={handleReply}
/>
```

### Compact Variant

```tsx
<PostCard
  post={post}
  variant="compact"
  showActions={false}
/>
```

### Detailed Variant

```tsx
<PostCard
  post={post}
  variant="detailed"
  showThread={true}
  onLike={handleLike}
/>
```

### With Media

```tsx
<PostCard
  post={{
    ...post,
    media: {
      type: 'image',
      url: '/post-image.jpg',
      thumbnail: '/post-thumb.jpg'
    }
  }}
  onLike={handleLike}
/>
```

### Reply Post

```tsx
<PostCard
  post={{
    ...post,
    replyTo: {
      id: 'parent123',
      author: 'Bob'
    }
  }}
  onLike={handleLike}
/>
```

### Highlighted

```tsx
<PostCard
  post={post}
  highlighted={true}
  onLike={handleLike}
/>
```

### Without Actions

```tsx
<PostCard
  post={post}
  showActions={false}
  onAuthorClick={() => {
    router.push(`/profile/${post.author.address}`);
  }}
/>
```

### In Feed

```tsx
function Feed({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          isLiked={likedPosts.includes(post.id)}
          onLike={() => toggleLike(post.id)}
          onReply={() => openReplyModal(post)}
          onShare={() => sharePost(post)}
        />
      ))}
    </div>
  );
}
```

### Thread View

```tsx
function ThreadView({ mainPost, replies }) {
  return (
    <div>
      <PostCard
        post={mainPost}
        variant="detailed"
        highlighted={true}
      />
      
      <div className="ml-12 border-l-2 border-gray-200">
        {replies.map(reply => (
          <PostCard
            key={reply.id}
            post={reply}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
```

## Time Display

- Just now
- 5m ago
- 2h ago
- Yesterday
- Oct 15
- Oct 15, 2023

## Media Handling

### Images
- Lazy loading
- Click to expand
- Alt text support

### Videos
- Thumbnail preview
- Play on click
- Muted autoplay option

## Styling

```tsx
<PostCard
  post={post}
  className="hover:bg-gray-50 transition-colors"
  onLike={handleLike}
/>
```

## Accessibility

- Semantic HTML structure
- ARIA labels for actions
- Keyboard navigation
- Screen reader friendly

## Performance

- Image lazy loading
- Memoized rendering
- Optimized re-renders
- Virtual scrolling ready

## Related Components

- [SocialFeed](/components/social-feed) - Post collections
- [LikeButton](/components/like-button) - Like interaction
- [PostButton](/components/post-button) - Create posts
- [MessageDisplay](/components/message-display) - Comments