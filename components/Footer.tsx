"use client";
import Link from "next/link";
import {
  Github as GithubIcon,
  Twitter as TwitterIcon,
  Heart as HeartIcon,
} from "lucide-react";
import { siteConfig } from "@/site.config";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <title>BigBlocks.dev Logo</title>
      <rect width="256" height="256" fill="none" />
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  ),
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

function FooterLink({ href, children, external = false }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-gray-400 hover:text-white transition-colors"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}

interface FooterColumnProps {
  title: string;
  links: {
    name: string;
    href: string;
    external?: boolean;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-gray-300">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <FooterLink href={link.href} external={link.external}>
              {link.name}
            </FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Link
      href={href}
      className="text-gray-400 hover:text-white transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}

export function Footer() {
  const footerLinks = siteConfig.footer.links.map(link => ({ name: link.title, href: link.href, external: true }));
  return (
    <footer className="relative py-12 px-4 border-t border-gray-900/50 bg-black">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-black opacity-50" />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Icons.logo className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {siteConfig.name}
              </h2>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              {siteConfig.description}
            </p>
            <div className="flex gap-4">
              <SocialLink
                href="https://github.com/bigblocks-dev"
                icon={<GithubIcon className="w-6 h-6" />}
                label="GitHub"
              />
              {siteConfig.seo.twitter.handle && (
                <SocialLink
                  href={`https://twitter.com/${siteConfig.seo.twitter.handle.replace('@', '')}`}
                  icon={<TwitterIcon className="w-6 h-6" />}
                  label="Twitter"
                />
              )}
            </div>
          </div>

          <FooterColumn
            title="Quick Links"
            links={[
              { name: "Sign In", href: "/signin" },
              { name: "Sign Up", href: "/signup" },
              { name: "Dashboard", href: "/dashboard" },
            ]}
          />

          <FooterColumn title="Resources" links={footerLinks} />
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>{siteConfig.footer.copyright}</p>
          <div className="flex items-center mt-2 md:mt-0">
            <span>Made with</span>
            <HeartIcon className="mx-1 h-4 w-4 text-red-500" />
            <span>by 1Sat team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 