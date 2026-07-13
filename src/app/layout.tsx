
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
  openGraph: {
    title: "Trisage Marketing | Premium Digital Agency in India",
    description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
    url: 'https://trisagemarketing.com',
    siteName: 'Trisage Marketing',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Trisage Marketing | Premium Digital Agency in India",
    description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
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
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-white dark:bg-[#050b14]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <Toaster 
              position="top-center" 
              theme="system" 
              closeButton
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: "pointer-events-auto relative flex items-center gap-3.5 w-full sm:w-max max-w-[calc(100vw-32px)] sm:min-w-[320px] px-4 sm:px-5 py-3.5 rounded-2xl border mb-3 mx-auto transition-all duration-300 shadow-2xl",
                  content: "order-2 flex-1 min-w-0 flex flex-col justify-center",
                  title: "text-[13px] sm:text-[15px] font-medium leading-relaxed tracking-wide text-left line-clamp-2",
                  error: "bg-white dark:bg-[#0a1220] border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 shadow-red-500/10",
                  success: "bg-white dark:bg-[#0a1220] border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10",
                  icon: "order-1 w-5 h-5 flex items-center justify-center shrink-0 drop-shadow-sm",
                  closeButton: "order-3 ml-2 shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white opacity-100 transition-colors border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:stroke-[2.5px]"
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
