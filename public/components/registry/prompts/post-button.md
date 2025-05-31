# PostButton

Create on-chain social posts on the Bitcoin blockchain using the bSocial protocol.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add post-button
```

## Usage

```tsx
import { PostButton } from 'bigblocks';

export default function SocialFeed() {
  return (
    <PostButton
      onPost={(post) => {
        console.log('Posted:', post);
        // Refresh feed
      }}
      placeholder="What's on your mind?"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onPost | `(post: Post) => void` | - | Callback after posting |
| onError | `(error: Error) => void` | - | Error callback |
| placeholder | `string` | `"What's happening?"` | Input placeholder |
| maxLength | `number` | `280` | Character limit |
| allowMedia | `boolean` | `true` | Allow image/video attachments |
| allowEmojis | `boolean` | `true` | Show emoji picker |
| theme | `'default' \| 'minimal' \| 'twitter'` | `'default'` | Visual theme |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| disabled | `boolean` | `false` | Disable posting |
| className | `string` | - | Additional CSS classes |

## Features

- **On-chain Posts**: Permanent blockchain storage
- **Media Attachments**: Images and videos support
- **Emoji Picker**: Rich text with emojis
- **Character Counter**: Real-time limit tracking
- **Draft Saving**: Auto-save drafts locally
- **Preview Mode**: Preview before posting
- **Thread Support**: Reply to existing posts

## Examples

### Basic Post Button

```tsx
<PostButton
  onPost={(post) => {
    toast.success('Posted successfully!');
    refreshFeed();
  }}
/>
```

### Twitter-like Theme

```tsx
<PostButton
  theme="twitter"
  placeholder="What's happening?"
  maxLength={280}
  onPost={handlePost}
/>
```

### Minimal Theme

```tsx
<PostButton
  theme="minimal"
  allowMedia={false}
  allowEmojis={false}
  onPost={handlePost}
/>
```

### With Error Handling

```tsx
<PostButton
  onPost={handlePost}
  onError={(error) => {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      toast.error('Not enough BSV for posting fee');
    } else {
      toast.error(error.message);
    }
  }}
/>
```

### Reply to Post

```tsx
<PostButton
  replyTo={parentPostId}
  placeholder="Write a reply..."
  onPost={(post) => {
    console.log('Reply posted:', post);
  }}
/>
```

### Different Sizes

```tsx
// Small
<PostButton size="sm" onPost={handlePost} />

// Medium (default)
<PostButton size="md" onPost={handlePost} />

// Large
<PostButton size="lg" onPost={handlePost} />
```

### With Media Upload

```tsx
<PostButton
  allowMedia={true}
  onPost={handlePost}
  onMediaUpload={(file) => {
    // Handle media file
    console.log('Uploading:', file.name);
  }}
/>
```

### In Social App

```tsx
function SocialApp() {
  const [posts, setPosts] = useState([]);
  
  return (
    <div>
      <PostButton
        onPost={async (post) => {
          // Add to feed immediately
          setPosts([post, ...posts]);
          
          // Track analytics
          analytics.track('post_created', {
            length: post.content.length,
            hasMedia: !!post.media
          });
        }}
      />
      
      <div className="mt-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

## Post Object

```typescript
interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  txid: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  replyTo?: string;
}
```

## Funding Requirements

- Each post requires a small BSV fee
- Fee covers blockchain storage
- Insufficient funds shows error

## Media Support

- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, WebM (max 100MB)
- Automatic compression
- IPFS storage integration

## Styling

```tsx
<PostButton
  className="border-2 border-blue-500 rounded-xl"
  onPost={handlePost}
/>
```

## Protocol Details

- Uses bSocial protocol
- OP_RETURN data format
- Permanent on-chain storage
- No centralized servers

## Related Components

- [CompactPostButton](/components/compact-post-button) - Minimal version
- [PostCard](/components/post-card) - Display posts
- [SocialFeed](/components/social-feed) - Post feed
- [LikeButton](/components/like-button) - Like posts