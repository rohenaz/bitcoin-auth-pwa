'use client';

import { AUTH_STYLES } from '@/lib/config/auth-styles';
import { AUTH_MESSAGES } from '@/lib/auth-messages';

interface BackupImportProps {
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  disabled?: boolean;
  className?: string;
}

export default function BackupImport({ onImport, disabled = false, className = '' }: BackupImportProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onImport(e);
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className={`border-t ${AUTH_STYLES.text.muted.replace('text-gray-400', 'border-gray-800')} pt-6 ${className}`}>
      <div className="text-center mb-4">
        <p className={`text-sm ${AUTH_STYLES.text.muted} mb-3`}>{AUTH_MESSAGES.labels.backupImport}</p>
        <label className={`cursor-pointer inline-flex items-center space-x-2 ${AUTH_STYLES.button.text.default} ${disabled ? AUTH_STYLES.button.text.disabled : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Import</title>
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <span className="text-sm font-medium">{AUTH_MESSAGES.labels.importBackupFile}</span>
          <input
            type="file"
            accept=".json,.txt"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </label>
        <p className={`text-xs ${AUTH_STYLES.text.secondary} mt-2`}>{AUTH_MESSAGES.labels.backupSupport}</p>
      </div>
    </div>
  );
}