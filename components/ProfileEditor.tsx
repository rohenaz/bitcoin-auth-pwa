'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useOAuthImage } from '@/hooks/useOAuthImage';
import { ENABLED_PROVIDERS, type EnabledProvider } from '@/lib/env';

interface ProfileData {
  alternateName?: string;
  image?: string;
  description?: string;
}

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (profile: { alternateName: string; image: string; description: string }) => Promise<void>;
  onPublish: () => Promise<void>;
}

export default function ProfileEditor({ isOpen, onClose, profile, onSave }: ProfileEditorProps) {
  const { data: session } = useSession();
  const { imageUrl: oauthImageUrl, error: oauthError } = useOAuthImage();
  const [formData, setFormData] = useState({
    alternateName: '',
    image: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        alternateName: profile.alternateName || '',
        image: profile.image || '',
        description: profile.description || ''
      });
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadProviderImage = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      // For OAuth sessions, we can use the session image directly
      if (session?.user?.provider === provider && session?.user?.image) {
        setFormData({ ...formData, image: session.user.image });
      } else {
        // Initiate OAuth flow to fetch image
        const currentUrl = window.location.pathname;
        window.location.href = `/api/auth/fetch-image?provider=${provider}&returnUrl=${encodeURIComponent(currentUrl)}`;
      }
    } catch (error) {
      console.error(`Error loading ${provider} image:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  // Update form when OAuth image is fetched
  useEffect(() => {
    if (oauthImageUrl) {
      setFormData(prev => ({ ...prev, image: oauthImageUrl }));
    }
  }, [oauthImageUrl]);

  // Show error toast if OAuth image fetch failed
  useEffect(() => {
    if (oauthError) {
      console.error('OAuth image error:', oauthError);
      // You could add a toast notification here
    }
  }, [oauthError]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="alternateName" className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="alternateName"
              value={formData.alternateName}
              onChange={(e) => setFormData({ ...formData, alternateName: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Profile Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex gap-2">
                {/* Google Icon */}
                {ENABLED_PROVIDERS.includes('google') && (
                  <button
                    type="button"
                    onClick={() => loadProviderImage('google')}
                    disabled={loadingProvider === 'google'}
                    className="p-2 border border-gray-700 rounded-md hover:border-gray-600 transition-colors disabled:opacity-50"
                    title="Load Google profile image"
                  >
                    {loadingProvider === 'google' ? (
                      <div className="w-5 h-5 animate-spin rounded-full border border-gray-600 border-t-gray-400" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    )}
                  </button>
                )}
                {/* GitHub Icon */}
                {ENABLED_PROVIDERS.includes('github') && (
                  <button
                    type="button"
                    onClick={() => loadProviderImage('github')}
                    disabled={loadingProvider === 'github'}
                    className="p-2 border border-gray-700 rounded-md hover:border-gray-600 transition-colors disabled:opacity-50"
                    title="Load GitHub profile image"
                  >
                    {loadingProvider === 'github' ? (
                      <div className="w-5 h-5 animate-spin rounded-full border border-gray-600 border-t-gray-400" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    )}
                  </button>
                )}
                {/* Twitter Icon - Only show if explicitly enabled */}
                {ENABLED_PROVIDERS.includes('twitter' as EnabledProvider) && (
                  <button
                    type="button"
                    onClick={() => loadProviderImage('twitter')}
                    disabled={loadingProvider === 'twitter'}
                    className="p-2 border border-gray-700 rounded-md hover:border-gray-600 transition-colors disabled:opacity-50"
                    title="Load X (Twitter) profile image"
                  >
                    {loadingProvider === 'twitter' ? (
                      <div className="w-5 h-5 animate-spin rounded-full border border-gray-600 border-t-gray-400" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
            {formData.image && (
              <div className="mt-2 flex items-center justify-center">
                <img 
                  src={formData.image} 
                  alt="Profile preview" 
                  className="w-16 h-16 rounded-full object-cover border border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-300 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <button
            onClick={() => {}}
            disabled={true}
            className="w-full px-4 py-2 bg-gray-800 text-gray-500 rounded-md font-medium cursor-not-allowed opacity-50"
          >
            Publish to Blockchain
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Publishing to blockchain coming soon
          </p>
        </div>
      </div>
    </div>
  );
}