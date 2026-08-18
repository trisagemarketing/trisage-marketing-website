"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ThemeToggle } from "@/components/ThemeToggle";

// Strict Zod Form Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Work email is required")
    .email("Please enter a valid work email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format (e.g. name@trisagemarketing.com)"
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Auto-prefill remembered email on page load if rememberMe was active
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("trisage_remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleNeedHelp = () => {
    setShowHelpModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0] === "email") formattedErrors.email = err.message;
        if (err.path[0] === "password") formattedErrors.password = err.message;
      });

      setFieldErrors(formattedErrors);
      const firstError = validationResult.error.issues[0]?.message || "Validation failed";
      setErrorMessage(firstError);
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Authenticating credentials...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: validationResult.data.email,
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorText = data.error || "Authentication failed. Please check your details.";
        setErrorMessage(errorText);
        toast.error(errorText, { id: toastId });
        setIsLoading(false);
        return;
      }

      // Handle Remember Me session persistence
      if (rememberMe) {
        localStorage.setItem("trisage_remembered_email", validationResult.data.email);
      } else {
        localStorage.removeItem("trisage_remembered_email");
      }

      toast.success(`Welcome back, ${data.user.full_name}!`, { id: toastId });

      const userRole = data.user.role;
      if (userRole === "hr" || userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login client error:", err);
      const networkErr = "Network error. Please check your connection and try again.";
      setErrorMessage(networkErr);
      toast.error(networkErr, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-slate-100 dark:bg-[#141b29] text-slate-900 dark:text-slate-100 flex flex-col justify-between relative font-sans selection:bg-secondary-500 selection:text-white transition-colors duration-300 normal-case pb-[env(safe-area-inset-bottom)]">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-gradient-to-b from-primary-500/15 via-secondary-500/10 to-transparent dark:from-[#2D4164]/30 dark:via-[#008080]/15 blur-3xl rounded-full transition-all duration-300" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-primary-600/10 via-secondary-600/5 to-transparent dark:from-[#263654]/25 dark:via-[#134e4a]/10 blur-3xl rounded-full transition-all duration-300" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b15_1px,transparent_1px),linear-gradient(to_bottom,#64748b15_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#26365420_1px,transparent_1px),linear-gradient(to_bottom,#26365420_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Image
            src="/logo.png"
            alt="Trisage Marketing Logo"
            width={180}
            height={50}
            priority
            className="h-8 sm:h-12 w-auto shrink-0 object-contain mix-blend-multiply dark:mix-blend-screen dark:brightness-125 dark:contrast-125"
          />
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700/60 hidden xs:block" />
          <span className="hidden xs:inline-block text-[10px] sm:text-xs font-bold tracking-widest text-secondary-600 dark:text-secondary-400 uppercase">
            EMS Portal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Centered Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 my-auto">
        <div className="w-full max-w-sm sm:max-w-md my-auto">
          <div className="relative group">
            {/* Ambient Ring Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-700 dark:from-[#2D4164] dark:via-[#008080] dark:to-[#263654] rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-40 transition duration-500" />

            <div className="relative bg-white/95 dark:bg-[#1f2a3e]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-700/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl dark:shadow-2xl transition-colors duration-300">
              {/* Card Header with 100% Transparent Logo Container */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center mb-2 sm:mb-3 w-16 h-16 sm:w-24 sm:h-24 bg-transparent p-0 transition-all">
                  <Image
                    src="/logo.png"
                    alt="Trisage Marketing Logo"
                    width={140}
                    height={140}
                    priority
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-screen dark:brightness-125 dark:contrast-125"
                  />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-normal text-slate-900 dark:text-white mb-1 sm:mb-2 font-sans uppercase">
                  Employee Login
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                  Sign in with your official Trisage Marketing credentials to access attendance & leave management.
                </p>
              </div>

              {/* Output Component: Error Alert Box */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 text-rose-700 dark:text-rose-200 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 dark:text-rose-400 mt-0.5 shrink-0" />
                  <div className="flex-1 leading-snug">{errorMessage}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" noValidate>
                {/* Work Email Input Component */}
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="email" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Work Email
                    </label>
                    {fieldErrors.email && (
                      <span className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold animate-in fade-in">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 dark:text-slate-400 pointer-events-none group-focus-within:text-secondary-600 dark:group-focus-within:text-secondary-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="username"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={!!fieldErrors.email}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@trisagemarketing.com"
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-3.5 bg-slate-50 dark:bg-[#141b29]/90 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-sans font-medium focus:outline-none transition-all duration-200 ${
                        fieldErrors.email
                          ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10"
                          : "border-slate-300 dark:border-slate-700/80 focus:border-secondary-500 dark:focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20 focus:bg-white dark:focus:bg-[#141b29]"
                      }`}
                    />
                  </div>
                </div>

                {/* Password Input Component */}
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {fieldErrors.password && (
                      <span className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold animate-in fade-in">
                        {fieldErrors.password}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 dark:text-slate-400 pointer-events-none group-focus-within:text-secondary-600 dark:group-focus-within:text-secondary-400 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={!!fieldErrors.password}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••••••"
                      className={`w-full pl-10 pr-11 py-3 sm:py-3.5 bg-slate-50 dark:bg-[#141b29]/90 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-sans font-medium focus:outline-none transition-all duration-200 ${
                        fieldErrors.password
                          ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10"
                          : "border-slate-300 dark:border-slate-700/80 focus:border-secondary-500 dark:focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20 focus:bg-white dark:focus:bg-[#141b29]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Session Option */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#141b29] text-secondary-600 dark:text-secondary-500 focus:ring-secondary-400/30 cursor-pointer"
                    />
                    <span>Remember my session</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleNeedHelp}
                    className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-500 dark:hover:text-secondary-300 underline underline-offset-4 transition-colors cursor-pointer text-xs font-semibold"
                  >
                    Need help?
                  </button>
                </div>

                {/* Spacious Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-primary-600/30 hover:shadow-secondary-600/40 hover:from-primary-500 hover:to-secondary-500 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer uppercase relative z-10"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="normal-case">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="normal-case text-sm sm:text-base font-extrabold">Sign in to Portal</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Need Help Modal Overlay */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4 text-primary-600 dark:text-secondary-400">
              <Shield className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">EMS Support & Password Reset</h3>
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              <p>
                Employee accounts & password reset credentials in the Trisage EMS Portal are managed exclusively by HR.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="block font-bold text-slate-800 dark:text-slate-200">HR Helpdesk SOP:</span>
                <span className="block text-slate-600 dark:text-slate-400">Email: hr@trisagemarketing.com</span>
                <span className="block text-slate-600 dark:text-slate-400">Office: HR Admin Desk</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
            >
              Got it, Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4 shrink-0 text-center text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Trisage Marketing Pvt. Ltd. All rights reserved. EMS Portal v1.0</p>
      </footer>
    </div>
  );
}
