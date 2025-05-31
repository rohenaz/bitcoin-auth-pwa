/**
 * Social Component Demos
 */

import React from 'react';
import { 
  PostButton,
  LikeButton,
  FollowButton,
  PostCard,
  SocialFeed,
  MessageDisplay,
  type SocialPost
} from 'bigblocks';
import type { ComponentDemo } from './index';


// FriendsDialog is not exported in v0.2.2
// function FriendsDialogDemo() {
//   const [isOpen, setIsOpen] = React.useState(false);
//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => setIsOpen(true)}
//         className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
//       >
//         Open Friends List
//       </button>
//       <FriendsDialog
//         open={isOpen}
//         onOpenChange={setIsOpen}
//       />
//     </div>
//   );
// }

export const socialDemos: Array<[string, ComponentDemo]> = [
  [
    'post-button',
    {
      id: 'post-button',
      render: (props) => (
        <PostButton
          onPost={(post) => {
            console.log('Post created:', post);
            props.onSuccess?.(post);
          }}
        />
      )
    }
  ],
  [
    'like-button',
    {
      id: 'like-button',
      render: () => (
        <div className="flex items-center gap-4">
          <LikeButton
            txid="demo-post-123"
            showCount={true}
          />
          <span className="text-gray-500">Click to like this post</span>
        </div>
      )
    }
  ],
  [
    'follow-button',
    {
      id: 'follow-button',
      render: () => (
        <div className="flex items-center gap-4">
          <FollowButton
            idKey="demo-user-456"
            isFollowing={false}
          />
          <span className="text-gray-500">Follow this user</span>
        </div>
      )
    }
  ],
  [
    'post-card',
    {
      id: 'post-card',
      render: () => {
        const post: SocialPost = {
            txId: 'demo-tx-123',
            content: 'Hello Bitcoin! This is a demo post on the blockchain.',
            author: {
              idKey: 'demo-author',
              currentAddress: '1BitcoinAddress...',
              rootAddress: '1RootAddress...',
              addresses: [],
              block: 800000,
              firstSeen: Date.now() - 86400000,
              timestamp: Date.now() - 3600000,
              valid: true,
              identity: {
                '@type': 'Person' as any,
                alternateName: 'Satoshi Demo'
              }
            },
            timestamp: Date.now(),
            app: 'bigblocks-demo'
          };
        
        return (
          <PostCard
            post={post}
            showActions={true}
          />
        );
      }
    }
  ],
  [
    'social-feed',
    {
      id: 'social-feed',
      render: () => (
        <SocialFeed
          posts={[
            {
              txId: 'demo-1',
              content: 'First post in the feed',
              author: {
                idKey: 'author-1',
                currentAddress: '1Address1...',
                rootAddress: '1RootAddr1...',
                addresses: [],
                block: 800000,
                firstSeen: Date.now() - 864000000,
                timestamp: Date.now() - 3600000,
                valid: true,
                identity: {
                  '@type': 'Person' as any,
                  alternateName: 'Alice'
                }
              },
              timestamp: Date.now() - 3600000,
              app: 'demo'
            },
            {
              txId: 'demo-2',
              content: 'Second post with reactions',
              author: {
                idKey: 'author-2',
                currentAddress: '1Address2...',
                rootAddress: '1RootAddr2...',
                addresses: [],
                block: 800000,
                firstSeen: Date.now() - 864000000,
                timestamp: Date.now() - 7200000,
                valid: true,
                identity: {
                  '@type': 'Person' as any,
                  alternateName: 'Bob'
                }
              },
              timestamp: Date.now() - 7200000,
              app: 'demo',
              reactions: [
                { emoji: '❤️', count: 5, userReacted: false },
                { emoji: '🚀', count: 2, userReacted: true }
              ]
            }
          ]}
        />
      )
    }
  ],
  [
    'message-display',
    {
      id: 'message-display',
      render: () => (
        <MessageDisplay
          message={{
            txId: 'a54d3af24a03bcc28f6b3f2dd0ad249ee042b2f4b95810ae5184ab617a74b8b9',
            content: 'Hello! This is a demo message from the Bitcoin blockchain. 🚀',
            contentType: 'text/plain' as const,
            timestamp: Date.now() - 1800000,
            app: 'bigblocks-demo',
            author: {
              idKey: 'demo-user-123',
              currentAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
              rootAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
              addresses: [],
              block: 800000,
              firstSeen: Date.now() - 864000000,
              timestamp: Date.now() - 1800000,
              valid: true,
              identity: {
                '@type': 'Person' as any,
                alternateName: 'Demo User',
                description: 'A demo user for showcasing MessageDisplay',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser'
              }
            }
          }}
          currentUserId="current-demo-user"
          showAvatar={true}
          showTimestamp={true}
          showDeliveryStatus={true}
          onUserClick={(user) => console.log('User clicked:', user)}
          onMessageClick={(message) => console.log('Message clicked:', message)}
        />
      )
    }
  ]
  // FriendsDialog is not exported in v0.2.2
  // [
  //   'friends-dialog',
  //   {
  //     id: 'friends-dialog',
  //     render: () => <FriendsDialogDemo />
  //   }
  // ]
];