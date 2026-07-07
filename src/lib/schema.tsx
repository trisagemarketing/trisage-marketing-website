import React from 'react';

/**
 * A highly scalable utility for generating W3C-compliant JSON-LD schema tags.
 * Designed as a Server Component helper to avoid client-side JavaScript execution.
 * 
 * Usage:
 * <JsonLd schema={{ "@context": "https://schema.org", "@type": "Service", ... }} />
 */
export function JsonLd({ schema }: { schema: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Reusable Base URLs and Identifiers for strict canonical linking
export const SCHEMA_CONSTANTS = {
  DOMAIN: 'https://trisagemarketing.com',
  ORG_ID: 'https://trisagemarketing.com/#organization',
  WEBSITE_ID: 'https://trisagemarketing.com/#website',
};
