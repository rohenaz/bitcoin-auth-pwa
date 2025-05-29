'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/showcase', label: 'Components' },
    { href: '/mcp-server', label: 'MCP Server' },
    { href: '/dashboard', label: 'Dashboard' }
  ];
  
  return (
    <nav className={`flex items-center space-x-6 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors ${
            pathname === link.href
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}