import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Custom overrides for styling
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold mb-6 mt-12 text-gray-900 dark:text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-medium mb-4 mt-8 text-gray-900 dark:text-white">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-medium mb-3 mt-6 text-gray-800 dark:text-gray-100">{children}</h4>,
    p: ({ children }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>,
    li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
    a: ({ href, children, ...props }) => (
      <a 
        href={href} 
        className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline font-medium"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-orange-500 pl-6 py-2 my-6 bg-orange-50 dark:bg-orange-950/20 rounded-r text-gray-700 dark:text-gray-300 italic">
        {children}
      </blockquote>
    ),
    ...components,
  };
}