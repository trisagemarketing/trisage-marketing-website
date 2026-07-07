import React from 'react';
import { JsonLd, SCHEMA_CONSTANTS } from '@/lib/schema';

type BreadcrumbItem = {
  name: string;
  item: string; // The absolute URL
};

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item.startsWith('http') ? crumb.item : `${SCHEMA_CONSTANTS.DOMAIN}${crumb.item}`,
    }))
  };

  return <JsonLd schema={schema} />;
}
