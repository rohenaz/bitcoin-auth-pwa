'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import Modal from './Modal';

interface MobileMemberExportProps {
  bapId: string;
}

export default function MobileMemberExport({ bapId }: MobileMemberExportProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      // Generate a time-limited token for member export
      const response = await fetch('/api/member-export/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bapId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate export token');
      }

      const { token: exportToken } = await response.json();
      setToken(exportToken);

      // Generate QR code with the link
      const exportUrl = `${window.location.origin}/export-member/${exportToken}`;
      const dataUrl = await QRCode.toDataURL(exportUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrDataUrl(dataUrl);
      setShowQR(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate export QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={generateQR}
        disabled={loading}
        className="w-full p-4 text-left border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium group-hover:text-white transition-colors">
              Export to Mobile
            </div>
            <div className="text-sm text-gray-400">
              Scan QR code to download on phone (decrypted)
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {showQR && (
        <Modal
          isOpen={showQR}
          onClose={() => {
            setShowQR(false);
            setQrDataUrl('');
            setToken('');
          }}
          title="Export Member Backup to Mobile"
        >
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <p className="text-sm text-gray-400 mb-4">
                Scan this QR code with your mobile device to download this member backup. 
                You'll need to enter your password on the mobile device.
              </p>
              <div className="bg-amber-900/20 border border-amber-900 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-400">
                  ⚠️ This QR code expires in 10 minutes for security
                </p>
              </div>
            </div>

            <div className="flex justify-center p-6 bg-white rounded-lg">
              <img src={qrDataUrl} alt="Member Export QR Code" />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Token: {token.substring(0, 8)}...
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}