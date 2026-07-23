"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';
import { EditorToolbar } from './EditorToolbar';

interface EditorProps {
  initialContent?: any;
  onChange: (content: any) => void;
  onAutoSave?: (content: any) => Promise<void>;
  editable?: boolean;
}

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    codeBlock: false,
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
    placeholder: 'Start writing your article...',
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Underline,
];

export default function BlogEditor({ 
  initialContent = '', 
  onChange, 
  onAutoSave,
  editable = true 
}: EditorProps) {
  
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class: 'prose sm:prose-lg dark:prose-invert prose-primary mx-auto focus:outline-none min-h-[500px] py-4',
      },
    },
    onUpdate: ({ editor }) => {
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
    }, 3000);

    return () => clearTimeout(handler);
  }, [editor?.state.doc, onAutoSave, editor]);

  if (!editor) {
    return <div className="h-125 w-full animate-pulse bg-gray-50 dark:bg-gray-800/50 rounded-2xl" />;
  }

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0a1220] shadow-sm">
      {/* Editor Toolbar */}
      <EditorToolbar editor={editor} />
      
      {/* Save Status Indicator */}
      {onAutoSave && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-medium text-gray-400 pointer-events-none">
          {isSaving ? (
            <><span className="animate-pulse w-2 h-2 rounded-full bg-amber-500" /> Saving...</>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-emerald-500" /> Saved to drafts</>
          )}
        </div>
      )}

      {/* Editor Content Area */}
      <div className="p-4 sm:p-8 md:p-12 font-rubik">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
