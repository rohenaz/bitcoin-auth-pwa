'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, Check, Terminal } from 'lucide-react';

interface TerminalCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function TerminalCodeBlock({ 
  code, 
  language = 'javascript', 
  filename,
  showLineNumbers = false,
  className = '' 
}: TerminalCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Mac terminal theme with darker background
  const macTerminalTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: '#0c0c0c',
      border: 'none',
      borderRadius: '0',
      padding: '0',
      margin: '0',
      overflow: 'hidden',
      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    comment: { color: '#6a9955' },
    string: { color: '#ce9178' },
    keyword: { color: '#569cd6' },
    function: { color: '#dcdcaa' },
    number: { color: '#b5cea8' },
    operator: { color: '#d4d4d4' },
    punctuation: { color: '#d4d4d4' },
    property: { color: '#9cdcfe' },
    'class-name': { color: '#4ec9b0' },
    variable: { color: '#9cdcfe' },
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Terminal window header */}
      <div className="bg-gray-800 border border-gray-700 rounded-t-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {filename && (
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Terminal className="w-4 h-4" />
              <span>{filename}</span>
            </div>
          )}
        </div>
        
        {/* Copy button */}
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-all duration-200 opacity-0 group-hover:opacity-100">
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </CopyToClipboard>
      </div>

      {/* Code content */}
      <div className="relative overflow-hidden rounded-b-xl border border-t-0 border-gray-700 bg-[#0c0c0c]">
        <SyntaxHighlighter
          language={language}
          style={macTerminalTheme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '24px',
            background: '#0c0c0c',
            fontSize: '14px',
            lineHeight: '1.6',
            borderRadius: 0,
          }}
          lineNumberStyle={{
            color: '#6e7681',
            fontSize: '12px',
            paddingRight: '16px',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
      </div>
    </div>
  );
}