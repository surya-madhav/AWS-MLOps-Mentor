"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils';
import mermaid from 'mermaid';

interface MarkdownProps {
  className?: string;
  children: string;
  conceptName?: string;
}

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif',
      themeVariables: {
        primaryColor: '#4a6da7',
        primaryTextColor: '#000000',
        primaryBorderColor: '#7C0200',
        lineColor: '#000000',
        secondaryColor: '#90b1e2',
        tertiaryColor: '#f8f9fa',
        fontSize: '16px',
      },
    });

    (async () => {
      if (!ref.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        ref.current.innerHTML = svg;
        ref.current.querySelectorAll('text').forEach((el) => {
          el.style.fill = '#000000';
          el.style.fontWeight = '500';
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        ref.current.innerHTML = `<pre>${error instanceof Error ? error.message : String(error)}</pre>`;
      }
    })();
  }, [chart]);

  return (
    <div
      ref={ref}
      className="mermaid my-4 p-4 bg-gray-50 dark:bg-gray-700 border rounded-md"
    />
  );
};

export function Markdown({ className, children, conceptName }: MarkdownProps) {
  const [content, setContent] = useState<string>(children);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sanitizeForFilePath = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  useEffect(() => {
    if (!conceptName) return;
    setIsLoading(true);

    (async () => {
      try {
        const filePath = `/concepts/${sanitizeForFilePath(conceptName)}.md`;
        const res = await fetch(filePath);
        if (res.ok) {
          setContent(await res.text());
        } else {
          setContent(children);
        }
      } catch {
        setContent(children);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [conceptName, children]);

  if (isLoading) {
    return <div className="py-4 text-center">Loading content...</div>;
  }

  const markdownContent = typeof content === 'string' ? content : '';

  const components: Partial<Components> = {
    code(props) {
      const { children, className } = props;
      const match = /language-(\w+)/.exec(className || '');

      if (match?.[1] === 'mermaid') {
        return <Mermaid chart={String(children)} />;
      }

      const isInline = !className;
      return (
        <code
          className={cn(
            isInline
              ? 'bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm'
              : 'block bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto',
            className,
          )}
        >
          {children}
        </code>
      );
    },
    a(props) {
      const { href, children } = props;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          aria-label={typeof children === 'string' ? children : 'External link'}
        >
          {children}
        </a>
      );
    },
    img(props) {
      const { src, alt } = props;
      return (
        <img
          src={src}
          alt={alt || 'Content image'}
          className="rounded-lg border my-4 mx-auto"
        />
      );
    },
    blockquote(props) {
      const { children } = props;
      const text = String(children);

      if (text.match(/Key Points:/i)) {
        return (
          <aside className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border-l-4 border-blue-500 my-4">
            {children}
          </aside>
        );
      }

      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic">
          {children}
        </blockquote>
      );
    },
    h1(props) {
      return <h1 className="text-2xl font-bold my-4">{props.children}</h1>;
    },
    h2(props) {
      return <h2 className="text-xl font-bold my-3">{props.children}</h2>;
    },
    h3(props) {
      return <h3 className="text-lg font-bold my-2">{props.children}</h3>;
    },
    h4(props) {
      return <h4 className="text-base font-bold my-2">{props.children}</h4>;
    },
    h5(props) {
      return <h5 className="text-sm font-bold my-1">{props.children}</h5>;
    },
    h6(props) {
      return <h6 className="text-xs font-bold my-1">{props.children}</h6>;
    },
  };

  return (
    <div
      className={cn(
        'prose dark:prose-invert max-w-prose mx-auto px-4',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
