import { createClient } from '@/lib/supabase/server';
import BlogEditorForm from './BlogEditorForm';
import { notFound } from 'next/navigation';

export default async function AdminBlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id === 'new') {
    return <BlogEditorForm blogId="new" />;
  }

  // Fetch existing blog (from drafts preferably, fallback to published)
  const supabase = await createClient();
  
  // Fetch the base published version FIRST to get all metadata
  const { data: publishedData } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (!publishedData) {
    notFound();
  }

  // Then check if there is an active draft with newer content/title
  const { data: draftData } = await supabase
    .from('blog_drafts')
    .select('*')
    .eq('blog_id', id)
    .single();

  // If there's a draft, merge it over the base blog data
  const initialBlog = draftData
    ? {
        ...publishedData,
        title: draftData.draft_title || publishedData.title,
        content: draftData.draft_content || publishedData.content,
      }
    : publishedData;

  return <BlogEditorForm initialBlog={initialBlog} blogId={id} />;
}
