"use client";

import React, { ErrorInfo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

// =======================
// ERROR BOUNDARY
// =======================
class BlockErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Block rendering failed:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 my-4 text-sm font-medium">
          ⚠️ A content block failed to render.
        </div>
      );
    }
    return this.props.children;
  }
}

// =======================
// CODE BLOCK WITH COPY
// =======================
const CodeBlock = ({ node }: { node: any }) => {
  const [copied, setCopied] = useState(false);
  const codeText = node.content?.[0]?.text || '';
  const language = node.attrs?.language || 'typescript';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden shadow-2xl border border-gray-800/60 group">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a2e] border-b border-gray-800">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/10 transition-all"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto bg-[#0d1117]">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem', lineHeight: '1.7' }}
          showLineNumbers={codeText.split('\n').length > 3}
          lineNumberStyle={{ color: '#4a5568', fontSize: '0.75rem' }}
        >
          {codeText}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// =======================
// INLINE TEXT RENDERER
// =======================
function renderInlineNodes(nodes: any[] | undefined): React.ReactNode {
  if (!nodes) return null;
  return nodes.map((node, idx) => {
    if (node.type === 'text') {
      let el: React.ReactNode = node.text;
      if (node.marks) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') el = <strong key={idx} className="font-semibold text-gray-900 dark:text-white">{el}</strong>;
          if (mark.type === 'italic') el = <em key={idx}>{el}</em>;
          if (mark.type === 'strike') el = <s key={idx}>{el}</s>;
          if (mark.type === 'code') el = (
            <code key={idx} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-rose-600 dark:text-rose-400 border border-gray-200 dark:border-gray-700">
              {el}
            </code>
          );
          if (mark.type === 'link') el = (
            <Link key={idx} href={mark.attrs.href} target={mark.attrs.target || '_blank'} className="text-primary-600 dark:text-primary-400 underline underline-offset-4 decoration-primary-300 dark:decoration-primary-700 hover:decoration-primary-500 transition-colors">
              {el}
            </Link>
          );
        });
      }
      return <React.Fragment key={idx}>{el}</React.Fragment>;
    }
    if (node.type === 'hardBreak') return <br key={idx} />;
    return null;
  });
}

// =======================
// NODE REGISTRY
// =======================
const BlockRegistry: Record<string, React.FC<{ node: any }>> = {

  paragraph: ({ node }) => {
    if (!node.content || node.content.length === 0) {
      return <div className="mb-4" />;
    }
    return (
      <p className="text-[1.125rem] leading-[1.85] text-gray-700 dark:text-gray-300 mb-7 font-normal tracking-[0.01em]">
        {renderInlineNodes(node.content)}
      </p>
    );
  },

  heading: ({ node }) => {
    const level = node.attrs?.level || 2;
    const text = node.content?.map((n: any) => n.text || '').join('') || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const content = renderInlineNodes(node.content);

    if (level === 1) return (
      <h1 id={id} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-14 mb-6 leading-tight tracking-tight">
        {content}
      </h1>
    );
    if (level === 2) return (
      <h2 id={id} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-14 mb-5 leading-snug tracking-tight relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-primary-500">
        {content}
      </h2>
    );
    if (level === 3) return (
      <h3 id={id} className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 leading-snug">
        {content}
      </h3>
    );
    return (
      <h4 id={id} className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">
        {content}
      </h4>
    );
  },

  bulletList: ({ node }) => (
    <ul className="mb-8 mt-2 space-y-3 pl-0 list-none">
      {node.content?.map((item: any, idx: number) => (
        <BlockErrorBoundary key={idx}>
          <li className="flex gap-3 text-[1.125rem] text-gray-700 dark:text-gray-300 leading-[1.8]">
            <span className="mt-[0.45rem] w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
            <span>{renderNodes(item.content)}</span>
          </li>
        </BlockErrorBoundary>
      ))}
    </ul>
  ),

  orderedList: ({ node }) => (
    <ol className="mb-8 mt-2 space-y-3 pl-0 list-none counter-reset-list">
      {node.content?.map((item: any, idx: number) => (
        <BlockErrorBoundary key={idx}>
          <li className="flex gap-3 text-[1.125rem] text-gray-700 dark:text-gray-300 leading-[1.8]">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-bold flex items-center justify-center mt-0.5">
              {idx + 1}
            </span>
            <span>{renderNodes(item.content)}</span>
          </li>
        </BlockErrorBoundary>
      ))}
    </ol>
  ),

  // listItem is now handled inline in bulletList/orderedList above
  listItem: ({ node }) => (
    <span>{renderNodes(node.content)}</span>
  ),

  blockquote: ({ node }) => (
    <blockquote className="relative my-10 pl-6 pr-6 py-6 border-l-4 border-primary-500 bg-gradient-to-r from-primary-50/60 to-transparent dark:from-primary-500/5 dark:to-transparent rounded-r-2xl">
      <span className="absolute top-3 left-5 text-6xl text-primary-200 dark:text-primary-900 font-serif leading-none select-none">"</span>
      <div className="text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
        {renderNodes(node.content)}
      </div>
    </blockquote>
  ),

  horizontalRule: () => (
    <div className="my-12 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      <div className="flex gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
      </div>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </div>
  ),

  image: ({ node }) => (
    <figure className="my-10 w-full">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={node.attrs.src}
          alt={node.attrs.alt || 'Blog image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {node.attrs.title && (
        <figcaption className="text-center text-sm text-gray-400 dark:text-gray-500 mt-3 italic">
          {node.attrs.title}
        </figcaption>
      )}
    </figure>
  ),

  codeBlock: CodeBlock,
};

// =======================
// RECURSIVE RENDERER
// =======================
function renderNodes(nodes: any[] | undefined): React.ReactNode {
  if (!nodes || !Array.isArray(nodes)) return null;

  return nodes.map((node, idx) => {
    // Handle inline text inside listItems
    if (node.type === 'text') {
      return renderInlineNodes([node]);
    }

    const Component = BlockRegistry[node.type];
    if (!Component) {
      console.warn(`[RichTextRenderer] Unknown node type: ${node.type}`);
      return null;
    }

    return (
      <BlockErrorBoundary key={idx}>
        <Component node={node} />
      </BlockErrorBoundary>
    );
  });
}

// =======================
// MAIN EXPORT
// =======================
export default function RichTextRenderer({ content }: { content: any }) {
  if (!content || !content.content) {
    return (
      <div className="text-gray-400 italic text-center py-16">
        No content available yet.
      </div>
    );
  }

  return (
    <article className="w-full max-w-none">
      {renderNodes(content.content)}
    </article>
  );
}
