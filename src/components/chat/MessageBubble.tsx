import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chatbot";
import Image from "next/image";
import { BOT_AVATAR } from "@/lib/constants/chatbot";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: ChatMessage;
  onOptionSelect?: (option: string) => void;
  currentInput?: string;
  showNextButton?: boolean;
  onNext?: () => void;
}

export default function MessageBubble({ message, onOptionSelect, currentInput, showNextButton, onNext }: MessageBubbleProps) {
  const isBot = message.type === "bot";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95, originX: isBot ? 0 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("flex w-full mt-4 space-x-3 max-w-xs sm:max-w-sm", isBot ? "ml-0 mr-auto" : "ml-auto mr-0 justify-end")}
    >
      {isBot && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center p-1.5 overflow-hidden">
            <Image 
              src={BOT_AVATAR} 
              alt="Bot Avatar" 
              width={20} 
              height={20} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
      
      <div className={cn("flex flex-col", isBot ? "items-start" : "items-end")}>
        <div 
          className={cn(
            "relative px-4 py-2.5 text-sm shadow-sm",
            isBot 
              ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700/50 rounded-2xl rounded-tl-sm" 
              : "bg-primary-600 dark:bg-primary-500 text-white rounded-2xl rounded-tr-sm"
          )}
        >
          {message.text}
        </div>
        
        {/* Render selectable options if present (e.g. Services) */}
        {message.isOptions && message.options && message.options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 w-full max-w-[260px]">
            {message.options.map((option, idx) => {
              const isSelected = currentInput && currentInput.includes(option);
              return (
              <button
                key={idx}
                onClick={() => onOptionSelect?.(option)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 shadow-sm text-left flex items-center gap-1.5",
                  isSelected 
                    ? "border-primary-500 bg-primary-600 text-white shadow-primary-500/25 dark:bg-primary-500 scale-95" 
                    : "border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800/50"
                )}
              >
                {isSelected && <Check size={14} className="shrink-0 stroke-[3]" />}
                {option}
              </button>
            )})}
            {showNextButton && (
              <div className="w-full mt-1.5 flex justify-end">
                <button
                  onClick={onNext}
                  className="text-xs font-bold px-4 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  Confirm <span className="text-[10px]">→</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
