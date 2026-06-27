"use client";

import { useTransition } from "react";
import { login } from "./actions";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
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
      } else if (result?.success) {
        toast.success(
          <>
            <span className="sm:hidden">Login successful</span>
            <span className="hidden sm:inline">Login successful. Redirecting...</span>
          </>
        );
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      }
    });
  };

  return (
    <div className="min-h-[100dvh] pb-[env(safe-area-inset-bottom)] z-100 flex items-center justify-center bg-[#f3fbf9] dark:bg-[#050b14] relative py-10 px-4">

      
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
