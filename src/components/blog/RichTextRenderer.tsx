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
// SECURITY: XSS ATTRIBUTE BOUNDARY
// =======================
function getSafeUrl(url: string | undefined | null): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url, 'https://dummy.com');
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (allowedProtocols.includes(parsed.protocol)) {
      return url;
    }
    return '#';
  } catch (e) {
    return url.startsWith('/') || url.startsWith('#') ? url : '#';
  }
}

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
// BLOCKNOTE AST RENDERER
// =======================
function renderBlockNoteInline(contentArr: any[] | undefined): React.ReactNode {
  if (!contentArr || !Array.isArray(contentArr)) return null;
  return contentArr.map((item: any, idx: number) => {
    if (item.type === 'text') {
      let el: React.ReactNode = item.text;
      if (item.styles) {
        if (item.styles.bold) el = <strong key={idx} className="font-extrabold text-gray-900 dark:text-white">{el}</strong>;
        if (item.styles.italic) el = <em key={idx}>{el}</em>;
        if (item.styles.underline) el = <u key={idx}>{el}</u>;
        if (item.styles.strikethrough) el = <s key={idx}>{el}</s>;
        if (item.styles.code) el = (
          <code key={idx} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-rose-600 dark:text-rose-400">
            {el}
          </code>
        );
      }
      if (item.href) {
        el = (
          <Link key={idx} href={getSafeUrl(item.href)} target="_blank" className="text-primary-600 dark:text-primary-400 underline underline-offset-4 font-semibold">
            {el}
          </Link>
        );
      }
      return <React.Fragment key={idx}>{el}</React.Fragment>;
    }
    return null;
  });
}

function renderBlockNoteBlocks(blocks: any[]): React.ReactNode {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block: any, idx: number) => {
    const inlineContent = renderBlockNoteInline(block.content);

    if (block.type === 'heading') {
      const level = block.props?.level || 2;
      if (level === 1 || level === 2) {
        return (
          <h2 key={block.id || idx} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-10 mb-4 leading-snug tracking-tight">
            {inlineContent}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 key={block.id || idx} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3 leading-snug tracking-tight">
            {inlineContent}
          </h3>
        );
      }
      return (
        <h4 key={block.id || idx} className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2.5">
          {inlineContent}
        </h4>
      );
    }

    if (block.type === 'bulletListItem') {
      return (
        <div key={block.id || idx} className="flex items-start gap-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 my-1.5 pl-2 sm:pl-4">
          <span className="mt-2.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
          <div className="flex-1">{inlineContent}</div>
        </div>
      );
    }

    if (block.type === 'numberedListItem') {
      return (
        <div key={block.id || idx} className="flex items-start gap-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 my-1.5 pl-2 sm:pl-4">
          <span className="font-bold text-primary-600 dark:text-primary-400 shrink-0 min-w-[20px]">{idx + 1}.</span>
          <div className="flex-1">{inlineContent}</div>
        </div>
      );
    }

    if (block.type === 'checkListItem') {
      const isChecked = block.props?.checked || false;
      return (
        <div key={block.id || idx} className="flex items-center gap-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 my-1.5">
          <input type="checkbox" checked={isChecked} readOnly className="w-5 h-5 rounded border-gray-300 text-primary-600 accent-primary-600 shrink-0" />
          <span className={isChecked ? "line-through opacity-70" : ""}>{inlineContent}</span>
        </div>
      );
    }

    if (block.type === 'image') {
      const url = block.props?.url;
      if (!url) return null;
      return (
        <figure key={block.id || idx} className="my-8 w-full">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-white/5">
            <Image src={getSafeUrl(url)} alt={block.props?.caption || "Blog image"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
          {block.props?.caption && (
            <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2.5 italic">{block.props.caption}</figcaption>
          )}
        </figure>
      );
    }

    // Default Paragraph
    return (
      <p key={block.id || idx} className="text-base sm:text-lg leading-[1.8] text-gray-700 dark:text-gray-300 mb-6 font-normal">
        {inlineContent}
      </p>
    );
  });
}

// =======================
// TIPTAP AST FALLBACK RENDERER
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
            <Link key={idx} href={getSafeUrl(mark.attrs.href)} target={mark.attrs.target || '_blank'} className="text-primary-600 dark:text-primary-400 underline underline-offset-4">
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

function renderNodes(nodes: any[] | undefined): React.ReactNode {
  if (!nodes || !Array.isArray(nodes)) return null;
  return nodes.map((node, idx) => {
    if (node.type === 'text') {
      return renderInlineNodes([node]);
    }
    if (node.type === 'paragraph') {
      return (
        <p key={idx} className="text-base sm:text-lg leading-[1.8] text-gray-700 dark:text-gray-300 mb-6 font-normal">
          {renderInlineNodes(node.content)}
        </p>
      );
    }
    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const content = renderInlineNodes(node.content);
      if (level === 1 || level === 2) return <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-10 mb-4 leading-snug tracking-tight">{content}</h2>;
      if (level === 3) return <h3 key={idx} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3 leading-snug tracking-tight">{content}</h3>;
      return <h4 key={idx} className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2.5">{content}</h4>;
    }
    return null;
  });
}

// =======================
// MAIN EXPORT
// =======================
export default function RichTextRenderer({ content }: { content: any }) {
  if (!content) {
    return (
      <div className="text-gray-400 italic text-center py-16">
        No content available yet.
      </div>
    );
  }

  // Handle BlockNote Array of Blocks
  if (Array.isArray(content)) {
    return (
      <article className="w-full max-w-full overflow-x-hidden break-words font-rubik">
        {renderBlockNoteBlocks(content)}
      </article>
    );
  }

  // Handle Tiptap AST object with .content
  if (content.content && Array.isArray(content.content)) {
    return (
      <article className="w-full max-w-full overflow-x-hidden break-words font-rubik">
        {renderNodes(content.content)}
      </article>
    );
  }

  // Handle String content (HTML or Plain Text)
  if (typeof content === 'string') {
    return (
      <article className="w-full max-w-full overflow-x-hidden break-words font-rubik prose sm:prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
    );
  }

  return null;
}
