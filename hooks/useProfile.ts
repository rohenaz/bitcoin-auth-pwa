import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface UserProfile {
  bapId?: string;
  alternateName?: string;
  image?: string;
  description?: string;
  // Legacy fields for backwards compatibility
  displayName?: string;
  avatar?: string;
  bapProfile?: {
    identity?: {
      alternateName?: string;
      image?: string;
      description?: string;
    };
  };
}

export function useProfile(bapId?: string) {
  const { data: session } = useSession();
  const targetBapId = bapId || session?.user?.id;

  return useQuery<UserProfile>({
    queryKey: ['profile', targetBapId],
    queryFn: async () => {
      const url = new URL('/api/users/profile', window.location.origin);
      if (bapId) {
        url.searchParams.set('bapId', bapId);
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!targetBapId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ 
      bapId, 
      data 
    }: { 
      bapId: string; 
      data: { alternateName?: string; image?: string; description?: string } 
    }) => {
      // Get the decrypted backup to extract the current address
      const decryptedBackupStr = sessionStorage.getItem('decryptedBackup');
      if (!decryptedBackupStr) {
        throw new Error('No decrypted backup found');
      }

      let currentAddress = '';
      try {
        const backup = JSON.parse(decryptedBackupStr);
        // Import required auth utilities
        const { extractIdentityFromBackup, createAuthTokenFromBackup } = await import('@/lib/bap-utils');
        
        // Extract identity information from backup
        const identity = extractIdentityFromBackup(backup);
        
        // For multi-profile support, we need to find the specific address for this bapId
        // If it's not the primary ID, we'll use the primary address for now
        currentAddress = identity.address;
        
        // Create auth token for this request
        const requestBody = JSON.stringify({ 
          bapId, 
          address: currentAddress,
          ...data 
        });
        const authToken = createAuthTokenFromBackup(backup, '/api/users/profile', requestBody);
        
        const response = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': authToken,
            ...(session?.user?.id !== bapId && {
              'X-Decrypted-Backup': decryptedBackupStr
            })
          },
          body: requestBody,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update profile');
        }

        return response.json();
      } catch (error) {
        console.error('Error in updateProfile:', error);
        throw error;
      }
    },
    onSuccess: (_, { bapId }) => {
      // Invalidate the profile query to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['profile', bapId] });
      // Also invalidate the profiles list
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    },
  });
}