import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from './components/docs/CodeBlock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom styled components
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold mb-6 mt-12 text-gray-900 dark:text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-medium mb-4 mt-8 text-gray-900 dark:text-white">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-medium mb-3 mt-6 text-gray-800 dark:text-gray-100">{children}</h4>,
    p: ({ children }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
    code: ({ children, className, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (language && typeof children === 'string') {
        const title = (props as any).title;
        return <CodeBlock language={language} title={title}>{children}</CodeBlock>;
      }
      
      return <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-orange-600 dark:text-orange-400" {...props}>{children}</code>;
    },
    pre: ({ children, ...props }) => {
      // Extract code content and language from pre > code structure
      if (typeof children === 'object' && children && 'props' in children) {
        const codeProps = (children as any).props;
        const className = codeProps?.className || '';
        const match = /language-(\w+)/.exec(className);
        const language = match ? match[1] : 'text';
        const title = codeProps?.title;
        
        if (typeof codeProps?.children === 'string') {
          return <CodeBlock language={language} title={title}>{codeProps.children}</CodeBlock>;
        }
      }
      
      return <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-sm" {...props}>{children}</pre>;
    },
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
    
    // Custom components
    CodeBlock,
    
    ...components,
  };
}