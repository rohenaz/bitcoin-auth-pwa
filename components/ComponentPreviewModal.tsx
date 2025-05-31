'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Sun, Moon, Share2, Bookmark, Maximize, Check, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComponentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentName: string;
  componentTitle: string;
  author?: string;
  authorAvatar?: string;
  children: React.ReactNode;
  promptPath?: string;
}

export function ComponentPreviewModal({
  isOpen,
  onClose,
  componentName,
  componentTitle,
  author = "Big Blocks",
  authorAvatar = "/icons/icon-192x192.png",
  children,
  promptPath
}: ComponentPreviewModalProps) {
  const [isDark, setIsDark] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Load bookmarks from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('component-bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(componentName));
  }, [componentName]);

  // Fetch prompt when modal opens
  useEffect(() => {
    if (isOpen && promptPath) {
      console.log('Fetching prompt from:', promptPath);
      fetch(promptPath)
        .then(res => {
          if (!res.ok) {
            console.error('Failed to fetch prompt:', res.status, res.statusText);
            return '';
          }
          return res.text();
        })
        .then(text => {
          console.log('Prompt loaded, length:', text.length);
          setPrompt(text);
        })
        .catch(err => {
          console.error('Error fetching prompt:', err);
        });
    }
  }, [isOpen, promptPath]);

  const handleCopyPrompt = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('component-bookmarks') || '[]');
    if (isBookmarked) {
      const updated = bookmarks.filter((b: string) => b !== componentName);
      localStorage.setItem('component-bookmarks', JSON.stringify(updated));
    } else {
      bookmarks.push(componentName);
      localStorage.setItem('component-bookmarks', JSON.stringify(bookmarks));
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${componentTitle} - BitcoinBlocks.dev`,
        text: `Check out the ${componentTitle} component on BitcoinBlocks.dev`,
        url: `${window.location.origin}/components#${componentName}`
      });
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-[50%] top-[50%] z-50 max-h-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border shadow-lg rounded-lg mx-auto flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-black transition-all duration-200 w-[90vw] h-[90vh] max-w-[1200px]"
          >
            {/* Header */}
            <div className="h-14 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Author Avatar */}
                <img 
                  src={authorAvatar} 
                  alt={author}
                  className="w-6 h-6 rounded-full"
                />
                
                {/* Component Info */}
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <h2 className="text-md font-medium flex gap-1 items-center truncate">
                    <span className="truncate">{componentTitle}</span>
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{author}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Copy Prompt */}
                <button
                  onClick={handleCopyPrompt}
                  className={`inline-flex items-center gap-2 px-3 h-8 rounded-lg transition-colors text-sm font-medium ${
                    prompt 
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!prompt}
                  title={prompt ? 'Copy component prompt' : promptPath ? 'Loading prompt...' : 'No prompt available'}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy prompt</span>
                    </>
                  )}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Bookmark */}
                <button
                  onClick={handleBookmark}
                  className="h-8 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="text-xs font-medium text-gray-500">
                    {localStorage.getItem('component-bookmarks') && 
                      JSON.parse(localStorage.getItem('component-bookmarks') || '[]').length}
                  </span>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>

                {/* Open Component */}
                <button
                  className="px-3 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors inline-flex items-center gap-2 text-sm font-medium"
                >
                  <span>Open component</span>
                  <kbd className="px-1.5 h-5 rounded border border-orange-700 bg-orange-800/50 text-[11px] inline-flex items-center">
                    ↵
                  </kbd>
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Component Preview */}
            <div className={`flex-1 overflow-auto p-8 ${isDark ? 'dark bg-black' : 'bg-white'}`}>
              <div className="max-w-4xl mx-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}