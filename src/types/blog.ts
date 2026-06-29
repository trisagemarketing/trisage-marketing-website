import { z } from "zod";

// =======================
// DATABASE SCHEMA TYPES
// =======================
export type BlogStatus = 'draft' | 'published';

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: any; // ProseMirror JSON tree
  cover_image: string | null;
  category: string;
  tags: string[];
  is_featured: boolean;
  read_time: string | null;
  
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;

  author_id: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;

  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogDraft {
  blog_id: string;
  draft_content: any;
  draft_title: string | null;
  last_autosaved_at: string;
  autosaved_by: string | null;
}

export interface BlogRevision {
  id: string;
  blog_id: string;
  content_snapshot: any;
  published_by: string | null;
  created_at: string;
}

// =======================
// DYNAMIC BLOCK SCHEMAS
// =======================
// We use Zod here so we can validate block attributes server-side
// before saving to the database, ensuring data integrity.

export const CtaBannerSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  buttonText: z.string().min(1, "Button text is required"),
  buttonUrl: z.string().url("Must be a valid URL").or(z.string().startsWith("/", "Must be a valid path")),
});
export type CtaBannerProps = z.infer<typeof CtaBannerSchema>;

export const TestimonialBlockSchema = z.object({
  quote: z.string().min(10, "Quote is too short"),
  authorName: z.string(),
  authorRole: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
export type TestimonialBlockProps = z.infer<typeof TestimonialBlockSchema>;

export const YouTubeEmbedSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
});
export type YouTubeEmbedProps = z.infer<typeof YouTubeEmbedSchema>;

// The unified Zod validation wrapper for all custom blocks
export const CustomBlockValidationRegistry: Record<string, z.ZodTypeAny> = {
  ctaBanner: CtaBannerSchema,
  testimonial: TestimonialBlockSchema,
  youtube: YouTubeEmbedSchema,
};
