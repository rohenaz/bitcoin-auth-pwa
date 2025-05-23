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
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.user?.id !== bapId && {
            'X-Decrypted-Backup': sessionStorage.getItem('decryptedBackup') || ''
          })
        },
        body: JSON.stringify({ bapId, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      return response.json();
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