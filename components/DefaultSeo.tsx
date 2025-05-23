import { DefaultSeo as NextDefaultSeo } from 'next-seo';
import { siteConfig } from '@/site.config';

export function DefaultSeo() {
  return (
    <NextDefaultSeo
      title={siteConfig.name}
      titleTemplate={siteConfig.seo.titleTemplate}
      defaultTitle={siteConfig.seo.title}
      description={siteConfig.seo.description}
      canonical={siteConfig.url}
      openGraph={{
        type: siteConfig.seo.openGraph.type,
        locale: siteConfig.seo.openGraph.locale,
        url: siteConfig.url,
        siteName: siteConfig.seo.openGraph.siteName,
        images: siteConfig.seo.openGraph.images,
      }}
      twitter={{
        handle: siteConfig.seo.twitter.handle,
        site: siteConfig.seo.twitter.site,
        cardType: siteConfig.seo.twitter.cardType,
      }}
      additionalMetaTags={[
        {
          name: 'keywords',
          content: siteConfig.seo.keywords.join(', '),
        },
        {
          name: 'theme-color',
          content: siteConfig.theme.background,
        },
        {
          name: 'application-name',
          content: siteConfig.name,
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black',
        },
        {
          name: 'apple-mobile-web-app-title',
          content: siteConfig.shortName,
        },
      ]}
      additionalLinkTags={[
        {
          rel: 'manifest',
          href: '/manifest.json',
        },
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/icons/icon-192x192.png',
        },
      ]}
    />
  );
}