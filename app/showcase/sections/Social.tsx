'use client';

import React, { useState } from 'react';
import {
  PostButton,
  LikeButton,
  FollowButton,
  SocialFeed,
  PostCard,
  type SocialPost
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Users } from 'lucide-react';


interface SocialSectionProps {
  isClient: boolean;
}

export function SocialSection({ isClient }: SocialSectionProps) {
  
  // Mock social data
  const mockPosts: SocialPost[] = [
    {
      txId: '123abc',
      app: 'twetch',
      author: {
        idKey: '1K6YQVzADTzDsFRadSQVRFo4RNmgpJakLK',
        currentAddress: '1K6YQVzADTzDsFRadSQVRFo4RNmgpJakLK',
        rootAddress: '1K6YQVzADTzDsFRadSQVRFo4RNmgpJakLK',
        addresses: [],
        block: 800000,
        firstSeen: Date.now() - 86400000,
        timestamp: Date.now() - 3600000,
        valid: true,
        identity: {
          '@type': 'Person',
          alternateName: 'Satoshi'
        } as any
      },
      content: 'Just deployed my first Bitcoin app! 🚀',
      timestamp: Date.now(),
      reactions: [
        { emoji: '❤️', count: 42, userReacted: false }
      ]
    },
    {
      txId: '456def',
      app: 'twetch',
      author: {
        idKey: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        currentAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        rootAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        addresses: [],
        block: 800000,
        firstSeen: Date.now() - 86400000,
        timestamp: Date.now() - 7200000,
        valid: true,
        identity: {
          '@type': 'Person',
          alternateName: 'Bitcoin Pioneer'
        } as any
      },
      content: 'Building the future of social media on Bitcoin SV',
      timestamp: Date.now() - 3600000,
      reactions: [
        { emoji: '❤️', count: 21, userReacted: true },
        { emoji: '🚀', count: 5, userReacted: false }
      ]
    }
  ];

  return (
    <section id="bsocial-demos" className="border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎭 Social Components</h2>
          <p className="text-gray-400 text-lg">Bitcoin-powered social interactions with on-chain data</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">bSocial Protocol</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Social Feed Demo */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Social Feed</h3>
              <p className="text-gray-400 mb-4">Bitcoin-based social media posts</p>
              
              {/* Backend Requirements */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend APIs:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <code className="text-orange-400">/api/social/posts</code> - Fetch social posts</li>
                  <li>• <code className="text-orange-400">/api/social/post</code> - Create new post (OP_RETURN)</li>
                  <li>• <code className="text-orange-400">/api/social/like</code> - Like a post</li>
                  <li>• <code className="text-orange-400">/api/social/follow</code> - Follow a user</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-blue-400 text-sm">💬 Demo: Mock social feed with real BSV transactions!</p>
              </div>
              
              {isClient ? (
                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <PostCard
                      key={post.txId}
                      post={post}
                    />
                  ))}
                </div>
              ) : (
                <div className="animate-pulse bg-gray-800 h-96 rounded-lg" />
              )}
            </div>
          </div>

          {/* Social Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Social Actions</h3>
              <p className="text-gray-400 mb-4">Post, like, and follow on-chain</p>
              
              {/* Funding Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">💰 Requires BSV Funding</h4>
                <p className="text-sm text-gray-300">Each social action is a real Bitcoin transaction</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Post Button */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Create Post</h4>
                <p className="text-gray-400 text-sm mb-3">Click to open the post composer</p>
                {isClient ? (
                  <PostButton
                    onPost={(post) => {
                      console.log('Posted:', post);
                    }}
                    placeholder="What's on your mind?"
                    variant="solid"
                  >
                    Create Post
                  </PostButton>
                ) : (
                  <div className="animate-pulse bg-gray-800 h-10 rounded-lg" />
                )}
              </div>

              {/* Like & Follow */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Like Post</h4>
                  {isClient ? (
                    <div className="text-gray-500 text-center py-2">
                      LikeButton unavailable
                    </div>
                  ) : (
                    <div className="animate-pulse bg-gray-800 h-10 rounded-lg" />
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Follow User</h4>
                  {isClient ? (
                    <div className="text-gray-500 text-center py-2">
                      FollowButton unavailable
                    </div>
                  ) : (
                    <div className="animate-pulse bg-gray-800 h-10 rounded-lg" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  PostButton,
  LikeButton,
  FollowButton 
} from 'bitcoin-auth-ui';

// Create a post
<PostButton
  onPost={(post) => {
    toast.success('Posted successfully!');
    refetchFeed();
  }}
  placeholder="What's on your mind?"
  variant="solid"
>
  Share Your Thoughts
</PostButton>

// Like a post
<LikeButton
  txid={post.txid}
  onLike={handleLike}
  onUnlike={handleUnlike}
  variant="ghost"
/>

// Follow a user
<FollowButton
  idKey={user.idKey}
  onFollow={handleFollow}
  onUnfollow={handleUnfollow}
  variant="solid"
/>`}
            language="jsx"
            filename="SocialActions.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  SocialFeed,
  PostCard,
  useSocialPost 
} from 'bitcoin-auth-ui';

function CustomSocialFeed() {
  const { data: posts, refetch } = useSocialPosts();
  const postMutation = useSocialPost();
  
  const handlePost = async (content) => {
    try {
      await postMutation.mutateAsync({
        content,
        mediaUrls: [],
        mentions: []
      });
      refetch();
    } catch (error) {
      console.error('Post failed:', error);
    }
  };
  
  return (
    <SocialFeed
      posts={posts}
      onLike={handleLike}
      onReply={handleReply}
      onRepost={handleRepost}
    />
  );
}`}
            language="jsx"
            filename="CustomSocialFeed.jsx"
          />
        </div>
      </div>
    </section>
  );
}