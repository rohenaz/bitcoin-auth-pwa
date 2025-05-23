'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import type { BapMasterBackup } from 'bitcoin-backup';
import { STORAGE_KEYS } from '@/lib/storage-keys';

interface Profile {
  idKey: string;
  address: string;
  name?: string;
  image?: string;
  isPrimary: boolean;
}

interface ProfileSwitcherProps {
  currentBapId?: string;
  onProfileChange?: (bapId: string) => void;
}

export default function ProfileSwitcher({ currentBapId, onProfileChange }: ProfileSwitcherProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    loadProfiles();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadProfiles();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const loadProfiles = async () => {
    try {
      // Get decrypted backup from session storage
      const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      if (!decryptedBackupStr) {
        setLoading(false);
        return;
      }

      const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
      const bap = new BAP(backup.xprv);
      bap.importIds(backup.ids);
      
      const profileList: Profile[] = [];
      const ids = bap.listIds();
      
      // Load profile data for each ID
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (!id) continue;
        const master = bap.getId(id);
        const memberBackup = master?.exportMemberBackup();
        
        if (memberBackup?.derivedPrivateKey) {
          const pubkey = PrivateKey.fromWif(memberBackup.derivedPrivateKey).toPublicKey();
          const address = pubkey.toAddress().toString();
          
          // Try to fetch profile data from both sources
          let profileName = `Profile ${i + 1}`;
          let profileImage = undefined;
          
          try {
            // First get user profile data (has latest updates)
            const userResponse = await fetch(`/api/users/profile?bapId=${id}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.alternateName) {
                profileName = userData.alternateName;
                profileImage = userData.image;
              }
            }
            
            // If no user data, try BAP profile
            if (profileName === `Profile ${i + 1}`) {
              const bapResponse = await fetch(`/api/bap?address=${address}`);
              if (bapResponse.ok) {
                const bapData = await bapResponse.json();
                const bapProfile = bapData.result;
                profileName = bapProfile?.identity?.alternateName || bapProfile?.identity?.name || profileName;
                profileImage = profileImage || bapProfile?.identity?.image;
              }
            }
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
          
          profileList.push({
            idKey: id,
            address,
            name: profileName,
            image: profileImage,
            isPrimary: i === 0
          });
        }
      }
      
      setProfiles(profileList);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = (profile: Profile) => {
    if (profile.idKey === currentBapId) {
      setIsOpen(false);
      return;
    }

    // Navigate to the selected profile's dashboard
    router.push(`/dashboard/${profile.idKey}`);
    
    if (onProfileChange) {
      onProfileChange(profile.idKey);
    }
    
    setIsOpen(false);
  };

  const handleCreateNew = async () => {
    setCreatingNew(true);
    
    try {
      // Get current password (you might want to prompt for this)
      const password = prompt('Enter your encryption password to create a new profile:');
      if (!password) {
        setCreatingNew(false);
        return;
      }

      // Get decrypted backup
      const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      if (!decryptedBackupStr) {
        throw new Error('No backup found');
      }

      const decryptedBackup = JSON.parse(decryptedBackupStr);
      
      // Validate backup structure before sending
      if (!decryptedBackup.xprv || !decryptedBackup.ids) {
        throw new Error('Invalid backup structure - missing required fields');
      }

      // Create auth token
      const { getAuthToken } = await import('bitcoin-auth');
      const { extractIdentityFromBackup } = await import('@/lib/bap-utils');
      
      const { privateKey } = extractIdentityFromBackup(decryptedBackup);
      const requestBody = JSON.stringify({ decryptedBackup, password });
      
      const authToken = getAuthToken({
        privateKeyWif: privateKey,
        requestPath: '/api/users/profiles/create',
        body: requestBody
      });

      // Call profile creation API
      const response = await fetch('/api/users/profiles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken
        },
        body: requestBody
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create profile');
      }

      const result = await response.json();
      
      // Update local storage with new encrypted backup
      if (result.encryptedBackup) {
        localStorage.setItem(STORAGE_KEYS.ENCRYPTED_BACKUP, result.encryptedBackup);
        
        // Decrypt the updated backup to get the complete state
        const { decryptBackup } = await import('bitcoin-backup');
        const updatedDecryptedBackup = await decryptBackup(result.encryptedBackup, password);
        
        // Store the properly updated backup
        sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_BACKUP, JSON.stringify(updatedDecryptedBackup));
      }

      // Reload profiles
      await loadProfiles();
      
      // Navigate to new profile
      router.push(`/dashboard/${result.profile.idKey}`);
      
    } catch (error) {
      console.error('Error creating new profile:', error);
      alert(`Failed to create new profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCreatingNew(false);
    }
  };

  const currentProfile = profiles.find(p => p.idKey === currentBapId) || profiles[0];

  if (loading) {
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
        {currentProfile?.image && (
          <img 
            src={currentProfile.image} 
            alt={currentProfile.name} 
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-sm font-medium">{currentProfile?.name}</span>
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
              
              {profiles.map((profile) => (
                <button
                  key={profile.idKey}
                  type="button"
                  onClick={() => handleProfileSelect(profile)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    profile.idKey === currentBapId 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  {profile.image ? (
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {profile.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{profile.name}</p>
                    {profile.isPrimary && (
                      <p className="text-xs text-gray-500">Primary</p>
                    )}
                  </div>
                  {profile.idKey === currentBapId && (
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <title>Current Profile</title>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
              
              {/* Create New Profile Button */}
              <div className="border-t border-gray-800 mt-2 pt-2">
                <button
                  type="button"
                  onClick={handleCreateNew}
                  disabled={creatingNew}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors disabled:opacity-50"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                    {creatingNew ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    ) : (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <title>Create New Profile</title>
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {creatingNew ? 'Creating...' : 'Create New Profile'}
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