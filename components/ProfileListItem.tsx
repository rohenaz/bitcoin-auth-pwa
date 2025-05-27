'use client';

import { useBlockchainImage } from 'bitcoin-image/react';

interface ProfileListItemProps {
  profile: {
    id: string;
    userData?: {
      displayName?: string;
      avatar?: string;
    };
    identity: {
      alternateName?: string;
      image?: string;
    };
  };
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function ProfileListItem({ profile, index, isSelected, onSelect }: ProfileListItemProps) {
  const profileName = profile.userData?.displayName || 
                     profile.identity.alternateName || 
                     `Profile ${index + 1}`;
  const profileImageUrl = profile.userData?.avatar || profile.identity.image || '';
  const { displayUrl: displayImageUrl } = useBlockchainImage(profileImageUrl);

  return (
    <button
      type="button"
      onClick={() => onSelect(profile.id)}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-blue-600/20 text-blue-400' 
          : 'hover:bg-gray-800 text-gray-300'
      }`}
    >
      {displayImageUrl ? (
        <img 
          src={displayImageUrl} 
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
      {isSelected && (
        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <title>Current Profile</title>
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}