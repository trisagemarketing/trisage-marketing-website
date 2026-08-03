"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useChatbot } from "@/hooks/useChatbot";

// Lazy-load the heavy ChatInterface chunk so it doesn't block the initial page render
const ChatInterface = dynamic(() => import("./ChatInterface"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ChatWidget() {
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");
  const { state, toggleOpen, handleInputSubmit, handleOptionSelect, resetSession } = useChatbot();

  // Hide entirely on Admin routes to prevent overlapping with Admin Mobile Nav
  if (pathname?.startsWith("/admin")) return null;

  const onSubmit = () => {
    handleInputSubmit(inputValue);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed inset-0 w-full h-full sm:relative sm:inset-auto sm:w-[380px] sm:h-[550px] sm:max-h-[calc(100vh-140px)] sm:mb-4 origin-bottom-right z-[1000]"
          >
            <ChatInterface 
              state={state}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={onSubmit}
              onOptionSelect={handleOptionSelect}
              onClose={toggleOpen}
              onReset={resetSession}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-600/30 flex items-center justify-center hover:shadow-2xl hover:shadow-primary-600/40 transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50"
        aria-label={state.isOpen ? "Close chat window" : "Open chat window"}
      >
        <AnimatePresence mode="wait">
          {state.isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} strokeWidth={2} className="fill-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification dot */}
        {!state.isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
}
