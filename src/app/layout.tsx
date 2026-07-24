import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import GlobalClickSpark from "@/components/GlobalClickSpark";
import LayoutWrapper from "@/components/LayoutWrapper";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL('https://trisagemarketing.com'),
  title: "Trisage Marketing | Premium Digital Agency in India",
  description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: ['/icon.png'],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: "Trisage Marketing | Premium Digital Agency in India",
    description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
    url: 'https://trisagemarketing.com',
    siteName: 'Trisage Marketing',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Trisage Marketing Logo',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Trisage Marketing | Premium Digital Agency in India",
    description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
    images: ['/logo.png'],
  },
};

const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://trisagemarketing.com/#website",
      "url": "https://trisagemarketing.com/",
      "name": "Trisage Marketing",
      "description": "Premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
      "publisher": {
        "@id": "https://trisagemarketing.com/#organization"
      },
      "inLanguage": "en-IN"
    },
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://trisagemarketing.com/#organization",
      "name": "Trisage Marketing",
      "url": "https://trisagemarketing.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://trisagemarketing.com/logo.png",
        "width": 1024,
        "height": 1024
      },
      "image": "https://trisagemarketing.com/logo.png",
      "description": "Trisage Marketing is a premium digital marketing agency in India helping ambitious brands scale through data-driven strategies and exceptional design.",
      "telephone": "+919217900934",
      "email": "admin@trisagemarketing.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "B-11, Amaltash Marg, & Block B, Sector 4",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201301",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://linkedin.com/company/trisage-marketing/",
        "https://instagram.com/trisagemarketing"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-white dark:bg-[#050b14]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <Toaster 
              position="top-center" 
              theme="system" 
              closeButton
              richColors
              offset={20}
              toastOptions={{
                className: "font-sans shadow-2xl rounded-2xl border text-xs sm:text-sm font-semibold",
                style: {
                  zIndex: 999999,
                }
              }}
            />
            <GlobalClickSpark />
            <AnalyticsTracker />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
