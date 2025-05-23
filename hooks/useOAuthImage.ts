'use client';

import { useEffect, useState } from 'react';

export function useOAuthImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse URL parameters for OAuth image state
    const params = new URLSearchParams(window.location.search);
    const oauthImageState = params.get('oauth_image_state');
    const errorParam = params.get('error');
    
    if (errorParam) {
      setError(errorParam);
      // Clean up URL
      const params = new URLSearchParams(window.location.search);
      params.delete('error');
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
    
    if (oauthImageState) {
      setLoading(true);
      // Fetch the OAuth image using the state
      fetch(`/api/users/oauth-image?state=${oauthImageState}`)
        .then(res => res.json())
        .then(data => {
          if (data.image) {
            setImageUrl(data.image);
          } else if (data.error) {
            setError(data.error);
          }
        })
        .catch(err => {
          console.error('Error fetching OAuth image:', err);
          setError('Failed to fetch image');
        })
        .finally(() => {
          setLoading(false);
          // Clean up URL
          const params = new URLSearchParams(window.location.search);
          params.delete('oauth_image_state');
          const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
          window.history.replaceState({}, '', newUrl);
        });
    }
  }, []); // Run once on mount

  return { imageUrl, loading, error };
}