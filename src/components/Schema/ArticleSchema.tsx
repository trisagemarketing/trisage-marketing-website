import React from 'react';
import { JsonLd, SCHEMA_CONSTANTS } from '@/lib/schema';
import { getAuthorByName } from '@/data/authors';

type ArticleData = {
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author_name: string;
  published_at?: string;
  updated_at?: string;
};

export default function ArticleSchema({ article }: { article: ArticleData }) {
  const articleUrl = `${SCHEMA_CONSTANTS.DOMAIN}/blog/${article.slug}`;
  const author = getAuthorByName(article.author_name);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.cover_image ? (article.cover_image.startsWith('http') ? article.cover_image : `${SCHEMA_CONSTANTS.DOMAIN}${article.cover_image}`) : undefined,
    "datePublished": article.published_at || new Date().toISOString(),
    "dateModified": article.updated_at || article.published_at || new Date().toISOString(),
    "url": articleUrl,
    "publisher": {
      "@id": SCHEMA_CONSTANTS.ORG_ID
    },
    "author": {
      "@type": "Person",
      "name": author ? author.name : article.author_name,
      "url": author?.linkedin,
      "sameAs": author?.linkedin ? [author.linkedin] : undefined
    }
  };

  return <JsonLd schema={schema} />;
}
