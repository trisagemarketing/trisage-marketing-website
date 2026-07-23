"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface EditorProps {
  initialContent?: any;
  onChange: (content: any) => void;
  onAutoSave?: (content: any) => Promise<void>;
  editable?: boolean;
}

export default function BlogEditor({ 
  initialContent = "", 
  onChange, 
  onAutoSave,
  editable = true 
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize BlockNote editor instance
  const editor = useCreateBlockNote({
    initialContent: Array.isArray(initialContent) && initialContent.length > 0 
      ? initialContent 
      : undefined,
  });

  // Debounced Autosave Effect
  useEffect(() => {
    if (!onAutoSave || !editor) return;

    const handler = setTimeout(async () => {
      setIsSaving(true);
      await onAutoSave(editor.document);
      setIsSaving(false);
    }, 3000);

    return () => clearTimeout(handler);
  }, [editor.document, onAutoSave, editor]);

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0a1220] shadow-sm min-h-[500px] py-4">
      {/* Save Status Indicator */}
      {onAutoSave && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 text-xs font-semibold text-gray-400 pointer-events-none bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
          {isSaving ? (
            <><span className="animate-pulse w-2 h-2 rounded-full bg-amber-500" /> Saving...</>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-emerald-500" /> Saved to drafts</>
          )}
        </div>
      )}

      {/* BlockNote Notion-Style View */}
      <div className="p-2 sm:p-6 font-rubik text-gray-900 dark:text-white">
        <BlockNoteView 
          editor={editor} 
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          editable={editable}
          onChange={() => {
            onChange(editor.document);
          }}
        />
      </div>
    </div>
  );
}
