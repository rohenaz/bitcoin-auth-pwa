import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ConnectedAccount {
  provider: string;
  connectedAt: string;
}

export function useConnectedAccounts() {
  return useQuery<ConnectedAccount[]>({
    queryKey: ['connectedAccounts'],
    queryFn: async () => {
      const response = await fetch('/api/users/connected-accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch connected accounts');
      }
      return response.json();
    },
  });
}

export function useDisconnectAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: string) => {
      const response = await fetch('/api/users/disconnect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to disconnect account');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate connected accounts to refetch
      queryClient.invalidateQueries({ queryKey: ['connectedAccounts'] });
    },
  });
}