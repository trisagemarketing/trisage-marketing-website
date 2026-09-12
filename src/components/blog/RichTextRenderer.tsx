"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TiptapJSONContent } from '@/types/blog';
import { isInternalUrl } from '@/lib/blog/resolver';

// =======================
// SECURITY: XSS ATTRIBUTE BOUNDARY
// =======================
function getSafeUrl(url: string | undefined | null): string {
  if (url === 'null' || url === 'undefined' || !url) {
    return '#';
  }

  // Preserve valid relative paths and anchor links immediately
  if (url.startsWith('/') || url.startsWith('#')) {
    return url;
  }

  // Auto-prefix external domains if user forgot https://
  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://') &&
    !url.startsWith('mailto:') &&
    !url.startsWith('tel:')
  ) {
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url, 'https://trisagemarketing.com');
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
// BLOCKNOTE AST RENDERER (LEGACY COMPATIBILITY)
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
        const safeUrl = getSafeUrl(item.href);
        const isInternal = isInternalUrl(safeUrl);
        el = (
          <Link
            key={idx}
            href={safeUrl}
            target={isInternal ? undefined : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-4 font-semibold transition-colors"
          >
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
          <h2 key={block.id || idx} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-10 mb-4 leading-snug tracking-tight font-rubik">
            {inlineContent}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 key={block.id || idx} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3 leading-snug tracking-tight font-rubik">
            {inlineContent}
          </h3>
        );
      }
      return (
        <h4 key={block.id || idx} className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2.5 font-rubik">
          {inlineContent}
        </h4>
      );
    }

    if (block.type === 'bulletListItem') {
      return (
        <div key={block.id || idx} className="flex items-start gap-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 my-1.5 pl-2 sm:pl-4 font-rubik">
          <span className="mt-2.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
          <div className="flex-1">{inlineContent}</div>
        </div>
      );
    }

    if (block.type === 'numberedListItem') {
      return (
        <div key={block.id || idx} className="flex items-start gap-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 my-1.5 pl-2 sm:pl-4 font-rubik">
          <span className="font-bold text-primary-600 dark:text-primary-400 shrink-0 min-w-[20px]">{idx + 1}.</span>
          <div className="flex-1">{inlineContent}</div>
        </div>
      );
    }

    if (block.type === 'checkListItem') {
      const isChecked = block.props?.checked || false;
      return (
        <div key={block.id || idx} className="flex items-center gap-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 my-1.5 font-rubik">
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
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 bg-gray-100 dark:bg-gray-800">
            <Image src={getSafeUrl(url)} alt={block.props?.caption || "Blog image"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
          {block.props?.caption && (
            <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2.5 italic font-rubik">{block.props.caption}</figcaption>
          )}
        </figure>
      );
    }

    // Default Paragraph
    return (
      <p key={block.id || idx} className="text-base sm:text-lg leading-[1.8] text-gray-700 dark:text-gray-300 mb-6 font-normal font-rubik">
        {inlineContent}
      </p>
    );
  });
}

// =======================
// TIPTAP AST RENDERER (COMPLETE CMS ENGINE)
// =======================

function resolveFallbackUrl(text: string): string | null {
  const t = text.toLowerCase().trim();
  if (!t) return null;

  // CTAs & Audits
  if (t.includes('audit') || t.includes('contact') || t.includes('book') || t.includes('enquir') || t.includes('get started')) {
    return '/contact';
  }

  // Known Trisage Services
  if (t.includes('brand strategy') || t.includes('brand identity')) {
    return '/services/brand-strategy';
  }
  if (t.includes('revenue management')) {
    return '/services/revenue-management';
  }
  if (t.includes('website design') || t.includes('seo & geo') || t.includes('geo ai')) {
    return '/services/website-design-seo';
  }
  if (t.includes('performance marketing')) {
    return '/services/performance-marketing';
  }
  if (t.includes('geo & gmb') || t.includes('gmb')) {
    return '/services/seo-gmb';
  }
  if (t.includes('content creation') || t.includes('copywriting')) {
    return '/services/content-copywriting';
  }
  if (t.includes('influencer') || t.includes('pr outreach')) {
    return '/services/influencer-pr';
  }
  if (t.includes('social media')) {
    return '/services/social-media-management';
  }

  return null;
}

function renderInlineNodes(nodes: TiptapJSONContent[] | undefined): React.ReactNode {
  if (!nodes) return null;
  return nodes.map((node, idx) => {
    if (node.type === 'text') {
      let el: React.ReactNode = node.text;
      const marks = node.marks || [];
      const linkMark = marks.find((m: any) => m.type === 'link');
      const hasLink = !!linkMark;

      // 1. Apply styling marks first (bold, italic, underline, strike, code)
      marks.forEach((mark: { type: string; attrs?: Record<string, unknown> }) => {
        if (mark.type === 'bold') {
          el = (
            <strong
              key={`b-${idx}`}
              className={hasLink ? "font-semibold" : "font-semibold text-gray-900 dark:text-white"}
            >
              {el}
            </strong>
          );
        }
        if (mark.type === 'italic') el = <em key={`i-${idx}`}>{el}</em>;
        if (mark.type === 'underline') el = <u key={`u-${idx}`}>{el}</u>;
        if (mark.type === 'strike') el = <s key={`s-${idx}`}>{el}</s>;
        if (mark.type === 'code') {
          el = (
            <code
              key={`c-${idx}`}
              className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-rose-600 dark:text-rose-400 border border-gray-200 dark:border-gray-700"
            >
              {el}
            </code>
          );
        }
      });

      // 2. Wrap with Link as the outermost component if link mark exists
      if (linkMark) {
        const isUnpublished = linkMark.attrs?.isUnpublished;
        let rawHref = linkMark.attrs?.href ?? (linkMark as any).href;

        // Resilient fallback: If mark is 'link' but rawHref is empty/missing, resolve known CTAs & services
        if (!rawHref || rawHref === '#' || rawHref === 'null' || rawHref === 'undefined') {
          rawHref = resolveFallbackUrl(String(node.text || '')) || '';
        }

        if (rawHref && rawHref !== '#' && rawHref !== 'null' && rawHref !== 'undefined') {
          const safeUrl = getSafeUrl(String(rawHref));
          const isInternal = isInternalUrl(safeUrl);
          el = (
            <Link
              key={`l-${idx}`}
              href={safeUrl}
              target={isInternal ? undefined : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer"}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-4 font-semibold transition-colors cursor-pointer inline"
            >
              {el}
            </Link>
          );
        } else if (isUnpublished) {
          // Linked internal article is currently unpublished/draft and has no valid destination
          el = <span key={`l-${idx}`} className="text-gray-900 dark:text-white font-medium">{el}</span>;
        }
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
    // 1. Plain Text
    if (node.type === 'text') {
      return renderInlineNodes([node]);
    }

    // 2. Paragraph
    if (node.type === 'paragraph') {
      return (
        <p key={idx} className="text-base sm:text-lg leading-[1.8] text-gray-700 dark:text-gray-300 mb-6 font-normal font-rubik">
          {renderInlineNodes(node.content)}
        </p>
      );
    }

    // 3. Headings (H1 to H4)
    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const content = renderInlineNodes(node.content);
      if (level === 1 || level === 2) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-10 mb-4 leading-snug tracking-tight font-rubik">
            {content}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3 leading-snug tracking-tight font-rubik">
            {content}
          </h3>
        );
      }
      return (
        <h4 key={idx} className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2.5 font-rubik">
          {content}
        </h4>
      );
    }

    // 4. Image Nodes (Responsive, SEO Alt, Caption)
    if (node.type === 'image') {
      const rawSrc = (node.attrs?.src as string) || '';
      const safeSrc = getSafeUrl(rawSrc);
      if (!safeSrc || safeSrc === '#') return null;

      const alt = (node.attrs?.alt as string) || (node.attrs?.caption as string) || 'Article Image';
      const caption = node.attrs?.caption as string | undefined;

      return (
        <figure key={idx} className="my-8 w-full">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 bg-gray-100 dark:bg-gray-800">
            <Image
              src={safeSrc}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2.5 italic font-rubik">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // 5. Bullet Lists
    if (node.type === 'bulletList') {
      return (
        <ul key={idx} className="my-5 pl-6 space-y-2 list-disc text-gray-700 dark:text-gray-300 font-rubik text-base sm:text-lg">
          {node.content?.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {renderNodes(item.content)}
            </li>
          ))}
        </ul>
      );
    }

    // 6. Ordered Lists
    if (node.type === 'orderedList') {
      return (
        <ol key={idx} className="my-5 pl-6 space-y-2 list-decimal text-gray-700 dark:text-gray-300 font-rubik text-base sm:text-lg">
          {node.content?.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {renderNodes(item.content)}
            </li>
          ))}
        </ol>
      );
    }

    // 7. List Items (standalone or fallback)
    if (node.type === 'listItem') {
      return <React.Fragment key={idx}>{renderNodes(node.content)}</React.Fragment>;
    }

    // 8. Blockquotes
    if (node.type === 'blockquote') {
      return (
        <blockquote key={idx} className="my-6 pl-5 border-l-4 border-primary-500 bg-gray-50/50 dark:bg-gray-800/30 py-3 pr-4 rounded-r-xl italic text-gray-700 dark:text-gray-300 font-rubik text-lg">
          {renderNodes(node.content)}
        </blockquote>
      );
    }

    // 9. Code Blocks
    if (node.type === 'codeBlock') {
      return (
        <pre key={idx} className="my-6 p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-sm overflow-x-auto border border-gray-800 leading-normal">
          <code>{renderInlineNodes(node.content)}</code>
        </pre>
      );
    }

    // 10. Horizontal Rules
    if (node.type === 'horizontalRule') {
      return <hr key={idx} className="my-10 border-gray-200 dark:border-gray-800" />;
    }

    // 11. Tables
    if (node.type === 'table') {
      return (
        <div key={idx} className="my-8 w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left font-rubik text-sm">
            {node.content?.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx === 0 ? "bg-gray-50 dark:bg-gray-900 font-bold text-gray-900 dark:text-white" : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"}>
                {row.content?.map((cell, cellIdx) => {
                  const isHeader = cell.type === 'tableHeader';
                  const CellTag = isHeader ? 'th' : 'td';
                  return (
                    <CellTag key={cellIdx} className={`px-4 py-3 border border-gray-200 dark:border-gray-800/80 text-sm align-top ${isHeader ? 'font-bold bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {cell.content?.map((c, cIdx) => (
                        <div key={cIdx} className="leading-relaxed py-0.5">
                          {c.content ? renderInlineNodes(c.content) : null}
                        </div>
                      ))}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </table>
        </div>
      );
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
      <div className="text-gray-400 italic text-center py-16 font-rubik">
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
