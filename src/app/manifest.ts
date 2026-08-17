import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trisage Marketing | Premium Digital Agency in India',
    short_name: 'Trisage Marketing',
    description: 'Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#050b14',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
