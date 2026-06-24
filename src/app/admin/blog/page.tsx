import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit2, Globe, FileText, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default async function AdminBlogDashboard() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Content Engine</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your blogs, marketing articles, and case studies.</p>
        </div>
        
        <Link 
          href="/admin/blog/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-[#0a1220] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#050b14] border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                <th className="hidden sm:table-cell px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {!blogs || blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No posts found. Create your first piece of content!
                  </td>
                </tr>
              ) : blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {blog.cover_image ? (
                        <div className="hidden sm:block relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={blog.cover_image} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="hidden sm:flex w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center flex-shrink-0 text-gray-400">
                          <FileText size={20} />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white leading-snug break-words">
                          {blog.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1.5 break-all">
                          {blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                    }`}>
                      {blog.status === 'published' ? <Globe size={12} /> : <FileText size={12} />}
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {blog.author_name}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/blog/${blog.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
