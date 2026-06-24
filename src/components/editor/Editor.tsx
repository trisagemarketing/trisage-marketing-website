"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';
import { EditorToolbar } from './EditorToolbar';


// Placeholder custom extension for a Marketing Block to prove scalability
// In a real app, this would be imported from a separate file:
// import { CtaBannerExtension } from './extensions/CtaBanner';

interface EditorProps {
  initialContent?: any;
  onChange: (content: any) => void;
  onAutoSave?: (content: any) => Promise<void>;
  editable?: boolean;
}

export default function BlogEditor({ 
  initialContent = {}, 
  onChange, 
  onAutoSave,
  editable = true 
}: EditorProps) {
  
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] }, // H1 is reserved for the blog title
        codeBlock: false, // We'd use a dedicated syntax highlighting block later
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Press / for commands, or start typing your masterpiece...',
      }),
    ],
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class: 'prose sm:prose-lg dark:prose-invert prose-primary mx-auto focus:outline-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      // Extract the JSON AST from Tiptap and pass it up
      const jsonContent = editor.getJSON();
      onChange(jsonContent);
    },
  });

  // Debounced Autosave Effect
  useEffect(() => {
    if (!onAutoSave || !editor) return;

    const handler = setTimeout(async () => {
      setIsSaving(true);
      await onAutoSave(editor.getJSON());
      setIsSaving(false);
    }, 3000); // Autosave 3 seconds after the user stops typing

    return () => clearTimeout(handler);
  }, [editor?.state.doc, onAutoSave, editor]);

  if (!editor) {
    return <div className="h-[500px] w-full animate-pulse bg-gray-50 dark:bg-gray-800/50 rounded-2xl" />;
  }

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0a1220] shadow-sm">
      {/* Editor Toolbar */}
      <EditorToolbar editor={editor} />
      
      {/* Save Status Indicator */}
      {onAutoSave && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-medium text-gray-400">
          {isSaving ? (
            <><span className="animate-pulse w-2 h-2 rounded-full bg-yellow-500" /> Saving...</>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-green-500" /> Saved to drafts</>
          )}
        </div>
      )}

      {/* Editor Content Area */}
      <div className="p-4 sm:p-8 md:p-12">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
