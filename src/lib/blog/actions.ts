"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { BlogStatus } from '@/types/blog';

// =======================
// SCHEMAS FOR VALIDATION
// =======================

const EditorJSONSchema = z.record(z.string(), z.any()); // Could be much stricter in prod, validating ProseMirror Node structure.

const SaveDraftSchema = z.object({
  blogId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  content: EditorJSONSchema,
  coverImage: z.string().transform(v => v === "" ? null : v).pipe(z.string().url().nullable()).optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().transform(v => v === "" ? null : v).pipe(z.string().url().nullable()).optional(),
});

const PublishSchema = SaveDraftSchema.extend({
  blogId: z.string().uuid(),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().url().nullable().optional(),
});

// =======================
// ACTIONS
// =======================

/**
 * Saves a WIP Draft. Does NOT publish to the main `blogs` table unless it has never been created.
 */
export async function saveDraft(formData: z.infer<typeof SaveDraftSchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const validated = SaveDraftSchema.parse(formData);
    
    // If it's a completely new post, we need to create an initial hidden 'draft' record in `blogs` 
    // just to get an ID so the draft table has a foreign key to attach to.
    let targetBlogId = validated.blogId;

    if (!targetBlogId) {
      const slug = validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { data: newBlog, error: insertError } = await supabase
        .from('blogs')
        .insert({
          title: validated.title,
          slug: slug,
          content: validated.content,
          status: 'draft',
          author_id: user.id,
          author_name: validated.authorName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Author',
          author_role: validated.authorRole || null,
          author_avatar: validated.authorAvatar || null,
          category: validated.category,
        })
        .select('id')
        .single();
        
      if (insertError) throw new Error("Failed to create initial draft container: " + insertError.message);
      targetBlogId = newBlog.id;
    }

    // Now upsert into the active `blog_drafts` table
    const { error: draftError } = await supabase
      .from('blog_drafts')
      .upsert({
        blog_id: targetBlogId,
        draft_content: validated.content,
        draft_title: validated.title,
        autosaved_by: user.id,
        last_autosaved_at: new Date().toISOString()
      }, { onConflict: 'blog_id' });

    if (draftError) throw new Error("Failed to save draft: " + draftError.message);

    // Also update the metadata in the base blogs table so it persists across reloads!
    // We update everything except the content/title which remain safely in the draft table until publish.
    if (validated.blogId) {
      await supabase
        .from('blogs')
        .update({
          category: validated.category,
          cover_image: validated.coverImage || null,
          tags: validated.tags,
          author_name: validated.authorName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Author',
          author_role: validated.authorRole || null,
          author_avatar: validated.authorAvatar || null,
        })
        .eq('id', targetBlogId);
    }

    console.log(`[CMS Logs] Autosaved draft for blog ${targetBlogId}`);
    return { success: true, blogId: targetBlogId };
  } catch (error: any) {
    console.error(`[CMS Logs] Draft save failed:`, error);
    return { error: error.message };
  }
}


/**
 * Transactional Publish Event
 * Uses the RPC function to guarantee atomicity.
 */
export async function publishBlog(formData: z.infer<typeof PublishSchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const validated = PublishSchema.parse(formData);

    // Call the custom RPC to ensure atomic update + snapshotting
    const { error: rpcError } = await supabase.rpc('publish_blog_transaction', {
      p_blog_id: validated.blogId,
      p_user_id: user.id,
      p_content: validated.content
    });

    if (rpcError) throw new Error("Atomic publish transaction failed: " + rpcError.message);

    // We also need to update the meta fields and slug which aren't in the base RPC
    const { error: metaError } = await supabase
      .from('blogs')
      .update({
        title: validated.title,
        slug: validated.slug,
        cover_image: validated.coverImage || null,
        category: validated.category,
        tags: validated.tags,
        author_name: validated.authorName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Author',
        author_role: validated.authorRole || null,
        author_avatar: validated.authorAvatar || null,
        meta_title: validated.metaTitle || null,
        meta_description: validated.metaDescription || null,
        canonical_url: validated.canonicalUrl || null,
      })
      .eq('id', validated.blogId);

    if (metaError) throw new Error("Meta update failed: " + metaError.message);

    // Trigger On-Demand Revalidation (ISR)
    // This instantly purges the static cache for the blog index and the specific article!
    revalidatePath('/blog');
    revalidatePath(`/blog/${validated.slug}`);

    console.log(`[CMS Logs] Successfully published and revalidated blog ${validated.slug}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[CMS Logs] Publish failed:`, error);
    return { error: error.message };
  }
}

// =======================
// CATEGORY ACTIONS
// =======================

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_categories')
      .select('id, name')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('[CMS Logs] Failed to fetch categories:', error);
    return [];
  }
}

export async function addCategory(name: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) throw new Error('Category name must be at least 2 characters.');

    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name: trimmed })
      .select('id, name')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('That category already exists.');
      throw error;
    }
    revalidatePath('/admin/blog');
    return { success: true, category: data };
  } catch (error: any) {
    console.error('[CMS Logs] Failed to add category:', error);
    return { error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase.from('blog_categories').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('[CMS Logs] Failed to delete category:', error);
    return { error: error.message };
  }
}
