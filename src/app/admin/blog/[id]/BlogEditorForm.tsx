"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/editor/Editor";
import { saveDraft, publishBlog, addCategory, deleteCategory, getCategories } from "@/lib/blog/actions";
import { toast } from "sonner";
import {
  ArrowLeft, Globe, Settings2, X, Check, Loader2,
  Link2, Tag, Image as ImageIcon, FileText, Clock,
  Plus, Trash2, UserCircle2, Save,
} from "lucide-react";
import Link from "next/link";
import { Blog } from "@/types/blog";
import NativeUploader from "@/components/blog/NativeUploader";

interface Props {
  initialBlog?: Blog | null;
  blogId?: string;
}

interface Category { id: string; name: string; }

export default function BlogEditorForm({ initialBlog, blogId: paramBlogId }: Props) {
  const router = useRouter();

  const [blogId, setBlogId] = useState<string | undefined>(
    paramBlogId !== "new" ? paramBlogId : undefined
  );

  const [title, setTitle] = useState(initialBlog?.title || "");
  const [category, setCategory] = useState(initialBlog?.category || "Uncategorized");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [excerpt, setExcerpt] = useState((initialBlog as any)?.excerpt || "");
  const [tags, setTags] = useState<string[]>((initialBlog as any)?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState<any>(initialBlog?.content || {});
  const [coverImage, setCoverImage] = useState(initialBlog?.cover_image || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [authorName, setAuthorName] = useState((initialBlog as any)?.author_name || "");
  const [authorRole, setAuthorRole] = useState((initialBlog as any)?.author_role || "");
  const [authorAvatar, setAuthorAvatar] = useState((initialBlog as any)?.author_avatar || "");

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  // Load categories on mount
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slug && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [title]);

  const handleAutoSave = async (latestContent: any) => {
    if (!title) return;
    setContent(latestContent);
    setIsSaving(true);
    const result = await saveDraft({
      blogId,
      title,
      content: latestContent,
      coverImage,
      category,
      tags,
      authorName,
      authorRole,
      authorAvatar,
    });
    setIsSaving(false);
    if (result.success) {
      setLastSaved(new Date());
      if (result.blogId && result.blogId !== blogId) setBlogId(result.blogId);
    }
  };

  const handleManualSave = async () => {
    if (!title) {
      toast.error("A title is required to save a draft.");
      return;
    }
    setIsSaving(true);
    const result = await saveDraft({
      blogId,
      title,
      content,
      coverImage,
      category,
      tags,
      authorName,
      authorRole,
      authorAvatar,
    });
    setIsSaving(false);
    if (result.success) {
      setLastSaved(new Date());
      if (result.blogId && result.blogId !== blogId) setBlogId(result.blogId);
      toast.success("Draft saved successfully.");
    } else {
      toast.error("Failed to save draft.", { description: result.error });
    }
  };

  const handlePublish = async () => {
    if (!title) {
      toast.error("A title is required before publishing.");
      return;
    }
    setIsPublishing(true);
    let targetBlogId = blogId;

    if (!targetBlogId) {
      const draftResult = await saveDraft({ blogId: undefined, title, content, coverImage, category, tags, authorName, authorRole, authorAvatar });
      if (!draftResult.success || !draftResult.blogId) {
        toast.error("Failed to prepare article.", { description: draftResult.error });
        setIsPublishing(false);
        return;
      }
      targetBlogId = draftResult.blogId;
      setBlogId(targetBlogId);
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const result = await publishBlog({ blogId: targetBlogId, title, slug: finalSlug, content, coverImage, category, tags, authorName, authorRole, authorAvatar });

    setIsPublishing(false);
    if (result.error) {
      toast.error("Failed to publish", { description: result.error });
    } else {
      toast.success("Published!", { description: "Your article is now live." });
      router.push("/admin/blog");
      router.refresh();
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#050b14]">

      {/* ── Main Editor ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a1220]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-3 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/admin/blog"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </Link>

          {/* Save status */}
          <div className="flex-1 flex justify-center">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Loader2 size={12} className="animate-spin" /> Saving...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Check size={12} className="text-green-500" />
                Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            ) : (
              <span className="text-xs text-gray-300 dark:text-gray-700">Draft</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle sidebar */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Post Settings"
            >
              <Settings2 size={18} />
            </button>

            {/* Save Draft */}
            <button
              onClick={handleManualSave}
              disabled={isSaving || isPublishing}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all disabled:opacity-50 border border-gray-200 dark:border-gray-700 shadow-sm"
              title="Save as Draft"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* Publish */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-primary-500/20"
            >
              {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
              <span className="hidden sm:inline">{isPublishing ? "Publishing..." : "Publish"}</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-6 sm:py-10">
          {/* Title */}
          <textarea
            ref={titleRef}
            rows={1}
            placeholder="Article Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 mb-6 sm:mb-8 px-0 leading-tight resize-none overflow-hidden"
          />

          {/* Tiptap Editor */}
          <BlogEditor
            initialContent={content}
            onChange={setContent}
            onAutoSave={handleAutoSave}
          />
        </div>
      </div>

      {/* ── Settings Sidebar ── */}
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 right-0 h-screen w-[320px] flex-shrink-0
          bg-white dark:bg-[#0a1220] shadow-2xl lg:shadow-none
          border-l border-gray-200 dark:border-gray-800
          overflow-y-auto z-50
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white dark:bg-[#0a1220] border-b border-gray-200 dark:border-gray-800 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-primary-500" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">Post Settings</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
            title="Close Settings"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Cover Image ── */}
          <SidebarSection icon={<ImageIcon size={14} />} label="Cover Image">
            <NativeUploader
              blogId={blogId || "drafts"}
              existingImageUrl={coverImage}
              onUploadComplete={(url) => setCoverImage(url)}
            />
          </SidebarSection>

          {/* ── Excerpt ── */}
          <SidebarSection icon={<FileText size={14} />} label="Excerpt">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary of the article shown on the blog listing page..."
              rows={3}
              maxLength={200}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none leading-relaxed"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{excerpt.length}/200</p>
          </SidebarSection>

          {/* ── Category ── */}
          <SidebarSection icon={<Tag size={14} />} label="Category">
            <CategoryManager
              categories={categories}
              selected={category}
              onSelect={setCategory}
              onAdd={(cat) => setCategories((prev) => [...prev, cat])}
              onDelete={(id) => {
                setCategories((prev) => prev.filter((c) => c.id !== id));
                if (categories.find((c) => c.id === id)?.name === category) {
                  setCategory(categories[0]?.name || "Uncategorized");
                }
              }}
            />
          </SidebarSection>

          {/* ── URL Slug ── */}
          <SidebarSection icon={<Link2 size={14} />} label="URL Slug">
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="auto-generated-from-title"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono"
              />
            </div>
            {slug && (
              <p className="text-xs text-gray-400 mt-1.5 truncate">
                /blog/<span className="text-primary-500">{slug}</span>
              </p>
            )}
          </SidebarSection>

          {/* ── Tags ── */}
          <SidebarSection icon={<Clock size={14} />} label="Tags">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag + Enter"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors border border-primary-100 dark:border-primary-500/20"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </SidebarSection>

          {/* ── Author ── */}
          <SidebarSection icon={<UserCircle2 size={14} />} label="Author">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <NativeUploader
                  blogId={blogId || "drafts"}
                  existingImageUrl={authorAvatar}
                  onUploadComplete={(url) => setAuthorAvatar(url)}
                  className="!w-12 !h-12 !min-h-0 !rounded-full shrink-0 !border-[1.5px]"
                  variant="avatar"
                />
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Avatar</p>
                  <p>100x100px recommended</p>
                </div>
              </div>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author full name"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Role / Title (e.g. SEO Strategist)"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </SidebarSection>

          {/* ── Publish button (sidebar) ── */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
            {isPublishing ? "Publishing..." : "Publish Article"}
          </button>

        </div>
      </aside>
    </div>
  );
}

// ── Reusable sidebar section wrapper ──
function SidebarSection({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-primary-500">{icon}</span>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      </div>
      {children}
    </div>
  );
}

// ── Dynamic Category Manager ──
function CategoryManager({
  categories,
  selected,
  onSelect,
  onAdd,
  onDelete,
}: {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (name: string) => void;
  onAdd: (cat: { id: string; name: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsAdding(true);
    const result = await addCategory(newName);
    setIsAdding(false);
    if (result.error) {
      toast.error(result.error);
    } else if (result.category) {
      onAdd(result.category);
      onSelect(result.category.name);
      setNewName("");
      setShowInput(false);
      toast.success(`Category "${result.category.name}" added!`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    const result = await deleteCategory(id);
    setDeletingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      onDelete(id);
      toast.success(`"${name}" removed`);
    }
  };

  return (
    <div className="space-y-2">
      {/* Category pills list */}
      <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
        {categories.length === 0 && (
          <p className="text-xs text-gray-400 italic py-2">No categories yet. Add one below.</p>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelect(cat.name)}
            className={`
              flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer border transition-all group
              ${selected === cat.name
                ? "bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-300"
                : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-200 dark:hover:border-primary-500/30"
              }
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected === cat.name ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`} />
              <span className="text-sm font-medium truncate">{cat.name}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(cat.id, cat.name); }}
              className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ml-2"
              title={`Remove ${cat.name}`}
            >
              {deletingId === cat.id
                ? <Loader2 size={11} className="animate-spin" />
                : <Trash2 size={11} />
              }
            </button>
          </div>
        ))}
      </div>

      {/* Add new category */}
      {showInput ? (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowInput(false); }}
            placeholder="Category name..."
            autoFocus
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-primary-300 dark:border-primary-500/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={isAdding || !newName.trim()}
            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          </button>
          <button
            onClick={() => { setShowInput(false); setNewName(""); }}
            className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-500 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-all mt-1"
        >
          <Plus size={12} /> Add Category
        </button>
      )}
    </div>
  );
}
