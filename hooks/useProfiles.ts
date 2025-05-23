import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BAP } from 'bsv-bap';
import type { BapMasterBackup } from 'bitcoin-backup';
import { STORAGE_KEYS } from '@/lib/storage-keys';

interface Profile {
  id: string;
  identity: {
    alternateName?: string;
    image?: string;
    description?: string;
  };
  userData?: {
    displayName?: string;
    avatar?: string;
  };
}

export function useProfiles() {
  return useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      if (!decryptedBackupStr) return [];

      try {
        const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
        const bap = new BAP(backup.xprv);
        bap.importIds(backup.ids);
        
        const profiles = await Promise.all(
          bap.listIds().map(async (idKey) => {
            // Fetch user data from API which includes BAP profile data
            try {
              const response = await fetch(`/api/users/profile?bapId=${idKey}`);
              const profileData = response.ok ? await response.json() : null;
              
              return {
                id: idKey,
                identity: profileData?.bapProfile?.identity || {},
                userData: {
                  displayName: profileData?.displayName,
                  avatar: profileData?.avatar
                }
              };
            } catch {
              return {
                id: idKey,
                identity: {},
                userData: {}
              };
            }
          })
        );
        
        return profiles;
      } catch (error) {
        console.error('Error loading profiles:', error);
        return [];
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      ids, 
      password 
    }: { 
      ids: string; 
      password: string 
    }) => {
      const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      if (!decryptedBackupStr) throw new Error('No backup found');

      const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
      
      // Get auth token using the primary identity
      const { extractIdentityFromBackup } = await import('@/lib/bap-utils');
      const { privateKey } = extractIdentityFromBackup(backup);
      
      const { getAuthToken } = await import('bitcoin-auth');
      const authToken = getAuthToken({
        privateKeyWif: privateKey,
        requestPath: '/api/users/profiles/create',
        body: JSON.stringify({ decryptedBackup: backup, password })
      });

      const response = await fetch('/api/users/profiles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken,
        },
        body: JSON.stringify({ decryptedBackup: backup, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create profile');
      }

      return response.json();
    },
    onSuccess: async (result, { password }) => {
      // Decrypt and store the updated backup
      const { decryptBackup } = await import('bitcoin-backup');
      const updatedDecryptedBackup = await decryptBackup(result.encryptedBackup, password);
      sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_BACKUP, JSON.stringify(updatedDecryptedBackup));
      
      // Invalidate profiles query to refetch
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}