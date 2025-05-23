'use client';

import { useState, useEffect } from 'react';

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

export default function ProfileEditor({ isOpen, onClose, profile, onSave, onPublish }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    alternateName: '',
    image: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

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
            <input
              type="text"
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
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