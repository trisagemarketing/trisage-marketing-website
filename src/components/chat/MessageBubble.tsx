import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chatbot";
import Image from "next/image";
import { BOT_AVATAR } from "@/lib/constants/chatbot";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: ChatMessage;
  onOptionSelect?: (option: string) => void;
}

export default function MessageBubble({ message, onOptionSelect }: MessageBubbleProps) {
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
              width={24} 
              height={24} 
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
            {message.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onOptionSelect?.(option)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800/50 transition-colors shadow-sm text-left"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
