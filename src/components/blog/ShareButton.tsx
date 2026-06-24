"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    // 1. Try native Web Share API (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
        return; // Success
      } catch (err: any) {
        // If user cancelled, just ignore. Otherwise fallback.
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        } else {
          return;
        }
      }
    }

    // 2. Fallback to copying link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Share Article"
      className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 hover:border-primary-300 dark:hover:border-primary-600 dark:hover:text-primary-400 transition-all active:scale-95"
    >
      <Share2 size={16} />
    </button>
  );
}
