"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading2, Heading3, Heading4, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, 
  ImageIcon, Quote, Code, Undo, Redo, RotateCcw
} from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
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
        placeholder: "Start typing your article here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class: "prose sm:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[420px] p-4 sm:p-6 font-rubik text-gray-900 dark:text-white leading-relaxed",
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
    return <div className="h-[500px] w-full animate-pulse bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800" />;
  }

  const Button = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
        isActive
          ? "bg-primary-600 text-white shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0a1220] shadow-sm">
      
      {/* Simple, Easy Top Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-gray-50/95 dark:bg-[#0d1728]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 select-none">
        
        {/* Undo / Redo */}
        <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={16} />
        </Button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Headings */}
        <Button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive("heading", { level: 2 })} 
          title="Heading 2 (H2)"
        >
          <Heading2 size={16} /> H2
        </Button>
        <Button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive("heading", { level: 3 })} 
          title="Heading 3 (H3)"
        >
          <Heading3 size={16} /> H3
        </Button>
        <Button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} 
          isActive={editor.isActive("heading", { level: 4 })} 
          title="Heading 4 (H4)"
        >
          <Heading4 size={16} /> H4
        </Button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Basic Text Formatting */}
        <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough size={16} />
        </Button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Text Alignment */}
        <Button onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeft size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenter size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Align Right">
          <AlignRight size={16} />
        </Button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Lists */}
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List">
          <List size={16} />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered List">
          <ListOrdered size={16} />
        </Button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Link & Image & Quote */}
        <Button 
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            let url = window.prompt("Enter URL:", previousUrl);
            if (url === null) return;
            if (url.trim() === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            
            // Auto-format the URL to prevent Tiptap from rejecting it and saving as null
            if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
              url = `https://${url}`;
            }
            
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }} 
          isActive={editor.isActive("link")} 
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </Button>

        <Button 
          onClick={() => {
            const url = window.prompt("Enter Image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }} 
          isActive={editor.isActive("image")} 
          title="Insert Image URL"
        >
          <ImageIcon size={16} />
        </Button>

        <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote Block">
          <Quote size={16} />
        </Button>
        
        <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code Block">
          <Code size={16} />
        </Button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Reset Formatting */}
        <Button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
          <RotateCcw size={16} />
        </Button>

        {/* Save Status Badge */}
        {onAutoSave && (
          <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-400 px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {isSaving ? (
              <><span className="animate-pulse w-2 h-2 rounded-full bg-amber-500" /> Saving...</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-emerald-500" /> Draft Saved</>
            )}
          </div>
        )}
      </div>

      {/* Editor Main Typing Content Area */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
