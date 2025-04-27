"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";

interface MarkdownProps {
  className?: string;
  children: string;
  conceptName?: string; // Optional concept name to look for .md file
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
        fontSize: '16px'
      }
    });
    
    try {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      console.log("Rendering mermaid chart:", chart);
      mermaid.render(id, chart, (svgCode: any) => {
        if (ref.current) {
          ref.current.innerHTML = svgCode;
          
          // Apply additional styling to SVG text elements to ensure visibility
          const textElements = ref.current.querySelectorAll('text');
          textElements.forEach(el => {
            el.style.fill = '#000000';
            el.style.fontWeight = '500';
          });
        }
      });
    } catch (error) {
      console.error("Mermaid rendering error:", error);
      if (ref.current) ref.current.innerHTML = `<pre>${error}</pre>`;
    }
  }, [chart]);
  
  return <div ref={ref} className="mermaid my-4 p-4 bg-gray-50 dark:bg-gray-700 border rounded-md" />;
};

export function Markdown({ className, children, conceptName }: MarkdownProps) {
  const [content, setContent] = useState<string>(children as string);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Function to sanitize concept name for file path
  const sanitizeForFilePath = (name: string): string => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  };
  
  // Try to load markdown file from public folder
  useEffect(() => {
    if (!conceptName) return;
    
    const fetchMarkdownFile = async () => {
      setIsLoading(true);
      
      try {
        // Create file path from concept name
        const filePath = `/concepts/${sanitizeForFilePath(conceptName)}.md`;
        console.log(`Attempting to load markdown file from: ${filePath}`);
        
        const response = await fetch(filePath);
        
        if (response.ok) {
          // File exists, use its content
          const mdContent = await response.text();
          console.log(`Successfully loaded markdown file for: ${conceptName}`);
          setContent(mdContent);
        } else {
          // File doesn't exist, use the provided content
          console.log(`No markdown file found for: ${conceptName}, using provided content`);
          setContent(children as string);
        }
      } catch (error) {
        console.error("Error loading markdown file:", error);
        // On error, fallback to provided content
        setContent(children as string);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarkdownFile();
  }, [conceptName, children]);
  
  // If loading, show a loading indicator
  if (isLoading) {
    return <div className="py-4 text-center">Loading content...</div>;
  }

  // Ensure content is a string
  const markdownContent = typeof content === 'string' ? content : '';

  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-prose mx-auto px-4",
        className
      )}
    >      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match && match[1] === "mermaid") {
              return <Mermaid chart={String(children)} />;
            }
            return (
              <code
                className={cn(
                  inline
                    ? "bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm"
                    : "block bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt}
                className="rounded-lg border my-4 mx-auto"
              />
            );
          },
          // Add custom styling for blockquotes, especially for Key Points
          blockquote({ node, children, ...props }) {
            const content = String(children);
            // Check if this is a key points section
            if (content.includes("Key Points:") || content.includes("key points:")) {
              return (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border-l-4 border-blue-500 my-4">
                  {children}
                </div>
              );
            }
            // Default blockquote styling
            return (
              <blockquote 
                className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic" 
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Fix header rendering
          h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold my-2">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-bold my-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-bold my-1">{children}</h6>,
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}