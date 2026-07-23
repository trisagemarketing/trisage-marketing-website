import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit2, Globe, FileText, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import DeleteBlogButton from '@/components/admin/DeleteBlogButton';

export default async function AdminBlogDashboard() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Blog Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage your blogs, marketing articles, and case studies.</p>
        </div>
        
        <Link 
          href="/admin/blog/new" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>New Post</span>
        </Link>
      </div>

      {/* Empty State */}
      {!blogs || blogs.length === 0 ? (
        <div className="bg-white dark:bg-[#0a1220] rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
          <FileText size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No posts found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Create your first piece of content to start publishing on your blog.
          </p>
          <Link 
            href="/admin/blog/new" 
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all"
          >
            <Plus size={16} />
            <span>Create First Post</span>
          </Link>
        </div>
      ) : (
        <>
          {/* 📱 MOBILE VIEW: Senior Action Cards (<768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {blogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white dark:bg-[#0a1220] rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3 relative overflow-hidden"
              >
                {/* Top Row: Thumbnail + Title + Status */}
                <div className="flex items-start gap-3">
                  {blog.cover_image ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                      <Image src={blog.cover_image} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center shrink-0 text-gray-400 border border-gray-200 dark:border-gray-800">
                      <FileText size={24} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        blog.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                      }`}>
                        {blog.status === 'published' ? <Globe size={10} /> : <FileText size={10} />}
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-[11px] text-gray-500 truncate mt-1">
                      /{blog.slug}
                    </p>
                  </div>
                </div>

                {/* Middle Metadata Row */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                    <User size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{blog.author_name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Draft'}</span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href={`/admin/blog/${blog.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-colors"
                  >
                    <Edit2 size={14} className="text-primary-600 dark:text-primary-400" />
                    <span>Edit Post</span>
                  </Link>

                  <div className="shrink-0 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-100 dark:border-red-900/50">
                    <DeleteBlogButton id={blog.id} title={blog.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 DESKTOP VIEW: Data Table (≥768px) */}
          <div className="hidden md:block bg-white dark:bg-[#0a1220] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#050b14] border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Post</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Author</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Published</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {blog.cover_image ? (
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                              <Image src={blog.cover_image} alt="" fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-gray-400">
                              <FileText size={20} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white leading-snug wrap-break-word">
                              {blog.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 break-all">
                              /{blog.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          blog.status === 'published' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}>
                          {blog.status === 'published' ? <Globe size={12} /> : <FileText size={12} />}
                          {blog.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {blog.author_name || 'Admin'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/blog/${blog.id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                            title="Edit article"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <DeleteBlogButton id={blog.id} title={blog.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

