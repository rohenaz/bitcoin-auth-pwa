'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles, useCreateProfile } from '@/hooks/useProfiles';

interface ProfileSwitcherProps {
  currentBapId?: string;
  onProfileChange?: (bapId: string) => void;
}

export default function ProfileSwitcher({ currentBapId, onProfileChange }: ProfileSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: profiles = [], isLoading } = useProfiles();
  const createProfileMutation = useCreateProfile();

  const handleProfileSelect = (profileId: string) => {
    if (profileId === currentBapId) {
      setIsOpen(false);
      return;
    }

    // Navigate to the selected profile's dashboard
    router.push(`/dashboard/${profileId}`);
    
    if (onProfileChange) {
      onProfileChange(profileId);
    }
    
    setIsOpen(false);
  };

  const handleCreateNew = async () => {
    // Get current password (you might want to prompt for this)
    const password = prompt('Enter your encryption password to create a new profile:');
    if (!password) return;

    // Generate a unique ID for the new profile
    const ids = `profile-${Date.now()}`;

    try {
      const result = await createProfileMutation.mutateAsync({ ids, password });
      
      // Navigate to new profile
      router.push(`/dashboard/${result.profile.idKey}`);
    } catch (error) {
      console.error('Error creating new profile:', error);
      alert(`Failed to create new profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const currentProfile = profiles.find(p => p.id === currentBapId) || profiles[0];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-700 rounded w-32" />
      </div>
    );
  }

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {(currentProfile?.userData?.avatar || currentProfile?.identity.image) && (
          <img 
            src={currentProfile.userData?.avatar || currentProfile.identity.image} 
            alt={currentProfile.userData?.displayName || currentProfile.identity.alternateName} 
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-sm font-medium">
          {currentProfile?.userData?.displayName || 
           currentProfile?.identity.alternateName || 
           `Profile ${profiles.findIndex(p => p.id === currentProfile?.id) + 1}`}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <title>Open Profile Switcher</title>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-1 uppercase tracking-wider">
                Your Profiles
              </div>
              
              {profiles.map((profile, index) => {
                const profileName = profile.userData?.displayName || 
                                  profile.identity.alternateName || 
                                  `Profile ${index + 1}`;
                const profileImage = profile.userData?.avatar || profile.identity.image;
                
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleProfileSelect(profile.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      profile.id === currentBapId 
                        ? 'bg-blue-600/20 text-blue-400' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={profileName} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {profileName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{profileName}</p>
                      {index === 0 && (
                        <p className="text-xs text-gray-500">Primary</p>
                      )}
                    </div>
                    {profile.id === currentBapId && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <title>Current Profile</title>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
              
              {/* Create New Profile Button */}
              <div className="border-t border-gray-800 mt-2 pt-2">
                <button
                  type="button"
                  onClick={handleCreateNew}
                  disabled={createProfileMutation.isPending}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors disabled:opacity-50"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                    {createProfileMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    ) : (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <title>Create New Profile</title>
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {createProfileMutation.isPending ? 'Creating...' : 'Create New Profile'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}