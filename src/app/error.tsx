'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
      <p className="text-gray-700 mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-8 py-4 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
