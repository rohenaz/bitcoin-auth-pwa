'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function DeviceLinkQR() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  const generateQRCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/device-link/generate', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate link');
      }
      
      const data = await response.json();
      setLinkUrl(data.url);
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(data.url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#FFFFFF',
          light: '#000000'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
      setTimeRemaining(data.expiresIn);
      
      // Start countdown
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setQrCodeUrl(null);
            setLinkUrl(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-4">Link New Device</h2>
      
      {!qrCodeUrl ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Generate a QR code to quickly sign in on another device
          </p>
          <button
            type="button"
            onClick={generateQRCode}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Scan this QR code with your other device
          </p>
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <img src={qrCodeUrl} alt="Device link QR code" className="block" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Expires in: <span className="font-mono text-orange-400">{formatTime(timeRemaining)}</span>
            </p>
            <p className="text-xs text-gray-600">
              Or visit: <code className="bg-gray-800 px-2 py-1 rounded text-xs break-all">{linkUrl}</code>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQrCodeUrl(null);
              setLinkUrl(null);
              setTimeRemaining(0);
            }}
            className="mt-4 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          The QR code contains a one-time link that expires in 10 minutes. 
          You'll need to enter your encryption password on the new device.
        </p>
      </div>
    </div>
  );
}