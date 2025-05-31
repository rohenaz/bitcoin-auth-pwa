# SocialFeed

Display a feed of on-chain social posts with real-time updates and interactions.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add social-feed
```

## Usage

```tsx
import { SocialFeed } from 'bigblocks';

export default function HomePage() {
  const posts = [
    {
      id: '1',
      content: 'Hello Bitcoin!',
      author: { name: 'Satoshi', address: '1A1zP1...' },
      timestamp: Date.now(),
      likes: 42,
      replies: 5
    }
  ];

  return (
    <SocialFeed
      posts={posts}
      onLoadMore={() => {
        console.log('Load more posts');
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| posts | `Post[]` | - | Array of posts to display |
| onLoadMore | `() => void` | - | Load more callback |
| onRefresh | `() => void` | - | Refresh feed callback |
| onPostClick | `(post: Post) => void` | - | Post click handler |
| loading | `boolean` | `false` | Loading state |
| hasMore | `boolean` | `true` | More posts available |
| emptyMessage | `string` | `'No posts yet'` | Empty state message |
| variant | `'default' \| 'compact' \| 'timeline'` | `'default'` | Feed variant |
| showActions | `boolean` | `true` | Show like/reply buttons |
| realtime | `boolean` | `false` | Enable real-time updates |
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
  };
  timestamp: number;
  txid?: string;
  likes?: number;
  replies?: number;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  replyTo?: string;
}
```

## Features

- **Infinite Scroll**: Load more on scroll
- **Real-time Updates**: New posts appear live
- **Interactive Posts**: Like, reply, share
- **Media Support**: Images and videos
- **Thread View**: Reply conversations
- **Pull to Refresh**: Mobile gesture support

## Examples

### Basic Feed

```tsx
<SocialFeed
  posts={posts}
  onLoadMore={loadMorePosts}
/>
```

### With Loading State

```tsx
<SocialFeed
  posts={posts}
  loading={isLoading}
  hasMore={hasMorePosts}
  onLoadMore={loadMorePosts}
/>
```

### Compact Variant

```tsx
<SocialFeed
  posts={posts}
  variant="compact"
  onLoadMore={loadMorePosts}
/>
```

### Timeline Variant

```tsx
<SocialFeed
  posts={posts}
  variant="timeline"
  onLoadMore={loadMorePosts}
/>
```

### Without Actions

```tsx
<SocialFeed
  posts={posts}
  showActions={false}
  onPostClick={(post) => {
    router.push(`/post/${post.id}`);
  }}
/>
```

### Real-time Feed

```tsx
function LiveFeed() {
  const [posts, setPosts] = useState([]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscribeToFeed((newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <SocialFeed
      posts={posts}
      realtime={true}
      onRefresh={async () => {
        const latest = await fetchLatestPosts();
        setPosts(latest);
      }}
    />
  );
}
```

### With Empty State

```tsx
<SocialFeed
  posts={[]}
  emptyMessage="Follow some users to see their posts"
  onLoadMore={loadMorePosts}
/>
```

### Filtered Feed

```tsx
function FilteredFeed({ filter }) {
  const posts = useMemo(() => {
    return allPosts.filter(post => {
      if (filter === 'following') {
        return following.includes(post.author.address);
      }
      if (filter === 'media') {
        return post.media !== undefined;
      }
      return true;
    });
  }, [allPosts, filter]);
  
  return (
    <SocialFeed
      posts={posts}
      onLoadMore={loadMorePosts}
    />
  );
}
```

### With Infinite Scroll

```tsx
function InfiniteFeed() {
  const {
    posts,
    loading,
    hasMore,
    loadMore
  } = useInfiniteScroll('/api/posts');
  
  return (
    <SocialFeed
      posts={posts}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}
```

## Styling

```tsx
<SocialFeed
  posts={posts}
  className="max-w-2xl mx-auto"
  onLoadMore={loadMorePosts}
/>
```

## Performance

- Virtualized rendering for large feeds
- Image lazy loading
- Debounced scroll handlers
- Memoized post components
- Optimistic UI updates

## Real-time Features

When `realtime` is enabled:
- New posts slide in from top
- Live like/reply counts
- Typing indicators
- Online status

## Mobile Features

- Pull to refresh gesture
- Smooth scrolling
- Touch-optimized buttons
- Responsive layout

## Related Components

- [PostCard](/components/post-card) - Individual posts
- [PostButton](/components/post-button) - Create posts
- [LikeButton](/components/like-button) - Post interactions
- [MessageDisplay](/components/message-display) - Comments