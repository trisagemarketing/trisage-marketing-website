import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading2, Heading3, Quote, List, ListOrdered, 
  ImageIcon, Link as LinkIcon 
} from 'lucide-react';

export function EditorToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    icon: any, 
    title: string 
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-gray-50/80 dark:bg-[#0a1220]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        title="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={Strikethrough}
        title="Strikethrough"
      />
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={Heading2}
        title="Heading 2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={Heading3}
        title="Heading 3"
      />

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        title="Numbered List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={Quote}
        title="Blockquote"
      />

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
      
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        isActive={editor.isActive('link')}
        icon={LinkIcon}
        title="Link"
      />
      
      <ToolbarButton
        onClick={() => {
          // In a real app, this would trigger a Supabase Storage upload,
          // then insert the returned URL into the editor.
          const url = window.prompt('Enter Image URL (Temporary fallback):');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        isActive={editor.isActive('image')}
        icon={ImageIcon}
        title="Insert Image"
      />
      
    </div>
  );
}
