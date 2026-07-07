import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import GlobalClickSpark from "@/components/GlobalClickSpark";
import LayoutWrapper from "@/components/LayoutWrapper";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Trisage Marketing | Premium Digital Agency in India",
  description: "Trisage Marketing is a premium digital agency specializing in SEO, Performance Marketing, and Growth Strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth" data-scroll-behavior="smooth">
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
                  toast: "pointer-events-auto relative flex items-center gap-2.5 sm:gap-3 !w-max sm:!w-max !max-w-[calc(100vw-32px)] sm:min-w-[320px] px-4 sm:px-5 py-3 sm:py-3.5 rounded-[20px] sm:rounded-[1.25rem] border-2 mb-3 mx-auto transition-all duration-300 shadow-xl",
                  content: "order-2 flex-1 min-w-0 flex flex-col justify-center",
                  title: "text-[14px] sm:text-[15px] font-medium leading-snug tracking-wide text-left text-balance sm:truncate sm:pr-6",
                  error: "bg-[#fcf0f2] dark:bg-[#2b1418] border-[#fc8a9d] text-[#e83655] shadow-[0_4px_24px_-8px_rgba(252,138,157,0.4)]",
                  success: "bg-[#f2fcf9] dark:bg-[#122b24] border-[#3ebda0] text-[#2ba185] shadow-[0_4px_24px_-8px_rgba(62,189,160,0.4)]",
                  icon: "order-1 w-5 h-5 sm:w-[18px] sm:h-[18px] flex items-center justify-center flex-shrink-0 drop-shadow-sm",
                  closeButton: "order-3 ml-auto relative sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-current opacity-100 transition-all border-none cursor-pointer m-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-3 sm:[&_svg]:h-3 [&_svg]:stroke-[2.5px]"
                }
              }} 
            />
            <CustomCursor />
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
