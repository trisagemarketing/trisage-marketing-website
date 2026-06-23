"use client";

import { useTransition } from "react";
import { login } from "./actions";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error(
          <>
            <span className="sm:hidden">Authentication failed</span>
            <span className="hidden sm:inline">{result.error}</span>
          </>
        );
      } else {
        toast.success(
          <>
            <span className="sm:hidden">Login successful</span>
            <span className="hidden sm:inline">Login successful.</span>
          </>
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#f3fbf9] dark:bg-[#050b14] overflow-hidden transition-colors duration-300">
      <Toaster 
        position="top-center" 
        theme="system" 
        closeButton
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: "pointer-events-auto relative flex items-center gap-2.5 sm:gap-3 !w-max sm:!w-max !max-w-[calc(100vw-32px)] sm:min-w-[320px] px-4 sm:px-5 py-3 sm:py-3.5 rounded-[20px] sm:rounded-[1.25rem] border-2 mb-3 mx-auto transition-all duration-300 shadow-xl -translate-x-3 sm:-translate-x-22",
            content: "order-2 flex-1 min-w-0 flex flex-col justify-center",
            title: "text-[14px] sm:text-[15px] font-medium leading-snug tracking-wide text-left text-balance sm:truncate sm:pr-6",
            error: "bg-[#fcf0f2] dark:bg-[#2b1418] border-[#fc8a9d] text-[#e83655] shadow-[0_4px_24px_-8px_rgba(252,138,157,0.4)]",
            success: "bg-[#f2fcf9] dark:bg-[#122b24] border-[#3ebda0] text-[#2ba185] shadow-[0_4px_24px_-8px_rgba(62,189,160,0.4)]",
            icon: "order-1 w-5 h-5 sm:w-[18px] sm:h-[18px] flex items-center justify-center flex-shrink-0 drop-shadow-sm",
            closeButton: "order-3 ml-auto relative sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-current opacity-100 transition-all border-none cursor-pointer m-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-3 sm:[&_svg]:h-3 [&_svg]:stroke-[2.5px]"
          }
        }} 
      />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-500/10 dark:bg-secondary-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Back to Home */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Website
          </Link>
        </div>

        <div className="relative group bg-white/60 dark:bg-[#0a1220]/60 backdrop-blur-2xl border border-white/40 dark:border-white/5 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)]">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-50" />
          
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4">
              <Image
                src="/logo.svg"
                alt="Trisage Marketing"
                width={160}
                height={45}
                priority
                className="h-10 w-auto transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
              />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Secure Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within/input:text-primary-500">
                  <Mail className="w-4 h-4 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner"
                  placeholder="admin@trisage.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-white text-sm font-bold tracking-wide bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 mt-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In Securely"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
