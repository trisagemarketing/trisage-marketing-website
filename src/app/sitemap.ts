import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trisagemarketing.com'; // Change this to actual domain

  // Function to generate strict IST (+05:30) ISO 8601 string
  const getISTString = () => {
    const d = new Date();
    const utcMs = d.getTime() + (d.getTimezoneOffset() * 60000);
    const istMs = utcMs + (3600000 * 5.5);
    const ist = new Date(istMs);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(ist.getDate())} ${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())}`;
  };

  const nowIST = getISTString();

  return [
    {
      url: baseUrl,
      lastModified: nowIST,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: nowIST,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: nowIST,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: nowIST,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: nowIST,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: nowIST,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];
}
