import React from 'react';
import { JsonLd, SCHEMA_CONSTANTS } from '@/lib/schema';

type ServiceData = {
  slug: string;
  title: string;
  longDescription: string;
};

/**
 * Generates Google Rich Results compliant Service schema.
 * It mathematically binds the service to the parent Organization via the provider @id.
 */
export default function ServiceSchema({ service }: { service: ServiceData }) {
  const serviceUrl = `${SCHEMA_CONSTANTS.DOMAIN}/services/${service.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}/#service`,
    "name": service.title,
    "description": service.longDescription,
    "url": serviceUrl,
    "provider": {
      "@id": SCHEMA_CONSTANTS.ORG_ID
    }
  };

  return <JsonLd schema={schema} />;
}
