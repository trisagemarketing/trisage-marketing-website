import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, 
  Heading2, Heading3, Heading4, Quote, List, ListOrdered, 
  ListChecks, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Indent, Outdent, Image as ImageIcon, Link as LinkIcon, Minus,
  RemoveFormatting, Undo, Redo, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function EditorToolbar({ editor }: { editor: Editor }) {
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showHeadingsMenu, setShowHeadingsMenu] = useState(false);

  const alignRef = useRef<HTMLDivElement>(null);
  const headingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (alignRef.current && !alignRef.current.contains(e.target as Node)) {
        setShowAlignMenu(false);
      }
      if (headingsRef.current && !headingsRef.current.contains(e.target as Node)) {
        setShowHeadingsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    icon: Icon, 
    title,
    disabled = false
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    icon: any, 
    title: string,
    disabled?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
        isActive 
          ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 font-bold shadow-xs' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <Icon size={17} />
    </button>
  );

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-gray-50/90 dark:bg-[#0a1220]/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 select-none">
      
      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        icon={Undo}
        title="Undo (Ctrl+Z)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        icon={Redo}
        title="Redo (Ctrl+Y)"
      />

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Heading Selector Dropdown */}
      <div className="relative" ref={headingsRef}>
        <button
          type="button"
          onClick={() => setShowHeadingsMenu(!showHeadingsMenu)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <span>
            {editor.isActive('heading', { level: 2 }) ? 'Heading 2' :
             editor.isActive('heading', { level: 3 }) ? 'Heading 3' :
             editor.isActive('heading', { level: 4 }) ? 'Heading 4' : 'Paragraph'}
          </span>
          <ChevronDown size={14} />
        </button>

        {showHeadingsMenu && (
          <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#0a1220] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-30 p-1.5 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setShowHeadingsMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Paragraph
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setShowHeadingsMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Heading 2
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setShowHeadingsMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Heading 3
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 4 }).run();
                setShowHeadingsMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Heading 4
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Basic Marks: Bold, Italic, Underline, Strike, Code */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        title="Bold (Ctrl+B)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        title="Italic (Ctrl+I)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={Underline}
        title="Underline (Ctrl+U)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={Strikethrough}
        title="Strikethrough"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={Code}
        title="Inline Code"
      />

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Alignment Dropdown */}
      <div className="relative" ref={alignRef}>
        <button
          type="button"
          onClick={() => setShowAlignMenu(!showAlignMenu)}
          title="Text Alignment"
          className="flex items-center gap-1 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {editor.isActive({ textAlign: 'center' }) ? <AlignCenter size={17} /> :
           editor.isActive({ textAlign: 'right' }) ? <AlignRight size={17} /> :
           editor.isActive({ textAlign: 'justify' }) ? <AlignJustify size={17} /> : <AlignLeft size={17} />}
          <ChevronDown size={12} />
        </button>

        {showAlignMenu && (
          <div className="absolute top-full left-0 mt-1 flex items-center gap-1 bg-white dark:bg-[#0a1220] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-30 p-1.5">
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().setTextAlign('left').run();
                setShowAlignMenu(false);
              }}
              isActive={editor.isActive({ textAlign: 'left' })}
              icon={AlignLeft}
              title="Align Left"
            />
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().setTextAlign('center').run();
                setShowAlignMenu(false);
              }}
              isActive={editor.isActive({ textAlign: 'center' })}
              icon={AlignCenter}
              title="Align Center"
            />
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().setTextAlign('right').run();
                setShowAlignMenu(false);
              }}
              isActive={editor.isActive({ textAlign: 'right' })}
              icon={AlignRight}
              title="Align Right"
            />
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().setTextAlign('justify').run();
                setShowAlignMenu(false);
              }}
              isActive={editor.isActive({ textAlign: 'justify' })}
              icon={AlignJustify}
              title="Justify"
            />
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Lists & Tasks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        title="Bulleted List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        title="Numbered List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        icon={ListChecks}
        title="Task List / Checklist"
      />

      {/* Indent / Outdent */}
      <ToolbarButton
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
        icon={Indent}
        title="Indent"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
        icon={Outdent}
        title="Outdent"
      />

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Blockquote & Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={Quote}
        title="Blockquote"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={Minus}
        title="Horizontal Line Divider"
      />

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Link & Image */}
      <ToolbarButton
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL:', previousUrl);
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        isActive={editor.isActive('link')}
        icon={LinkIcon}
        title="Insert Link"
      />
      
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter Image URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        isActive={editor.isActive('image')}
        icon={ImageIcon}
        title="Insert Image URL"
      />

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Clear Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        icon={RemoveFormatting}
        title="Clear Formatting"
      />

    </div>
  );
}
