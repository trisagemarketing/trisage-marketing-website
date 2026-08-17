import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
// import GlobalClickSpark from "@/components/GlobalClickSpark";
import LayoutWrapper from "@/components/LayoutWrapper";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Toaster } from "sonner";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL('https://trisagemarketing.com'),
  title: "Trisage Marketing | Premium Digital Agency in India",
  description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
  appleWebApp: {
    title: 'Trisage Marketing',
    statusBarStyle: 'default',
    capable: true,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HHGVZ3JZGV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HHGVZ3JZGV');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-white dark:bg-[#050b14]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <Toaster 
              position="top-center" 
              expand={false}
              duration={3500}
              offset={80}
              toastOptions={{
                unstyled: true,
                style: {
                  width: "max-content",
                  maxWidth: "none",
                  minWidth: "max-content",
                  whiteSpace: "nowrap",
                },
                classNames: {
                  toast: "!w-auto !max-w-none !whitespace-nowrap flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-white/95 dark:bg-[#1f2a3e]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white font-sans text-xs sm:text-sm font-extrabold z-[999999] mx-auto shrink-0",
                  title: "!whitespace-nowrap font-extrabold text-slate-900 dark:text-white",
                  description: "!whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs font-normal",
                  actionButton: "!whitespace-nowrap bg-secondary-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl",
                  cancelButton: "!whitespace-nowrap bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl",
                  success: "border-l-4 border-l-emerald-500",
                  error: "border-l-4 border-l-rose-500",
                  info: "border-l-4 border-l-secondary-500",
                  warning: "border-l-4 border-l-amber-500",
                },
              }}
            />
            {/* <GlobalClickSpark /> */}
            <AnalyticsTracker />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <ChatWidget />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
