/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  disabled?: boolean;
  isLocked?: boolean; // New prop: prevents typing but retains focus/keyboard
  isLoading?: boolean;
  error?: string | null;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Type your message...", 
  type = "text",
  disabled = false,
  isLocked = false,
  isLoading = false,
  error = null
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when it becomes enabled
  useEffect(() => {
    if (!disabled && !isLoading) {
      // Small timeout to ensure rendering is complete before focus
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [disabled, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLocked && !isLoading) {
        onSubmit();
        // Force focus retention on mobile Enter key
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <div className="relative flex items-center w-full shadow-sm rounded-full bg-white dark:bg-gray-800 border focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-200">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "w-full bg-transparent py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none rounded-full",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
            inputRef.current?.focus();
          }}
          onPointerDown={(e) => e.preventDefault()}
          disabled={!value.trim() || disabled || isLocked || isLoading}
          className="absolute right-1.5 p-2 rounded-full text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 transition-colors shadow-sm"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <SendHorizontal size={16} />
          )}
        </button>
      </div>
      
      {/* Error Message Display */}
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 font-medium px-4 absolute -bottom-5 left-0">
          {error}
        </span>
      )}
    </div>
  );
}
