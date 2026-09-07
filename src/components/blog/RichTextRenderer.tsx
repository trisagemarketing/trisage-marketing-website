"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TiptapJSONContent } from '@/types/blog';

// =======================
// SECURITY: XSS ATTRIBUTE BOUNDARY
// =======================
function getSafeUrl(url: string | undefined | null): string {
  if (url === 'null' || url === 'undefined') {
    console.warn("[RichTextRenderer Debug] Received literal string 'null' or 'undefined' as URL");
    return '#';
  }
  
  if (!url) {
    console.warn("[RichTextRenderer Debug] Received null/undefined URL");
    return '#';
  }
  
  // Auto-prefix domains if user forgot https://
  if (!url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
    console.log("[RichTextRenderer Debug] Auto-prefixing URL:", url);
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url, 'https://dummy.com');
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (allowedProtocols.includes(parsed.protocol)) {
      return url;
    }
    return '#';
  } catch {
    return url.startsWith('/') || url.startsWith('#') ? url : '#';
  }
}


// =======================
// BLOCKNOTE AST RENDERER
// =======================
function renderBlockNoteInline(contentArr: TiptapJSONContent[] | undefined): React.ReactNode {
  if (!contentArr || !Array.isArray(contentArr)) return null;
  return contentArr.map((item: TiptapJSONContent, idx: number) => {
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

function renderBlockNoteBlocks(blocks: TiptapJSONContent[]): React.ReactNode {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block: TiptapJSONContent, idx: number) => {
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

function renderInlineNodes(nodes: TiptapJSONContent[] | undefined): React.ReactNode {
  if (!nodes) return null;
  return nodes.map((node, idx) => {
    if (node.type === 'text') {
      let el: React.ReactNode = node.text;
      if (node.marks) {
        node.marks.forEach((mark: { type: string; attrs?: Record<string, unknown> }) => {
          if (mark.type === 'bold') el = <strong key={idx} className="font-semibold text-gray-900 dark:text-white">{el}</strong>;
          if (mark.type === 'italic') el = <em key={idx}>{el}</em>;
          if (mark.type === 'strike') el = <s key={idx}>{el}</s>;
          if (mark.type === 'code') el = (
            <code key={idx} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-rose-600 dark:text-rose-400 border border-gray-200 dark:border-gray-700">
              {el}
            </code>
          );
          if (mark.type === 'link') {
            const href = mark.attrs?.href;
            if (href && href !== 'null' && href !== 'undefined') {
              const target = mark.attrs?.target || '_blank';
              el = (
                <Link key={idx} href={getSafeUrl(String(href))} target={String(target)} className="text-primary-600 dark:text-primary-400 underline underline-offset-4">
                  {el}
                </Link>
              );
            }
          }
        });
      }
      return <React.Fragment key={idx}>{el}</React.Fragment>;
    }
    if (node.type === 'hardBreak') return <br key={idx} />;
    return null;
  });
}

function renderNodes(nodes: TiptapJSONContent[] | undefined): React.ReactNode {
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
export default function RichTextRenderer({ content }: { content: TiptapJSONContent | TiptapJSONContent[] | string }) {
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
  if (typeof content !== 'string' && content.content && Array.isArray(content.content)) {
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
