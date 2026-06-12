import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-white dark:bg-[#050b14] transition-colors duration-300">
      
      {/* Background Glow Effect for extra contrast and premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary-500/10 dark:bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* The 404 Text - Upgraded to a highly visible, premium gradient */}
        <h1 className="text-9xl md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-600 mb-4 leading-none tracking-tighter drop-shadow-sm">
          404
        </h1>
        
        {/* Subheadings */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Page Not Found
        </h2>
        
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        {/* Call to Action */}
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full transition-all shadow-lg hover:shadow-primary-600/25 dark:hover:shadow-primary-500/25 hover:-translate-y-1"
        >
          <Home size={20} />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
