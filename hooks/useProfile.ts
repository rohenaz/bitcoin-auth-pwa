import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface UserProfile {
  displayName?: string;
  avatar?: string;
  description?: string;
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
        const { BAP } = await import('bitcoin-wallet-sdk');
        const { signAuthToken } = await import('@/lib/auth-helpers');
        
        // Initialize BAP with the backup
        const bap = new BAP(backup.xprv);
        const id = await bap.getId(bapId);
        currentAddress = id.address;
        
        // Create auth token for this request
        const authToken = await signAuthToken('/api/users/profile', backup);
        
        const response = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': authToken,
            ...(session?.user?.id !== bapId && {
              'X-Decrypted-Backup': decryptedBackupStr
            })
          },
          body: JSON.stringify({ 
            bapId, 
            address: currentAddress,
            ...data 
          }),
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