import { z } from 'zod/v4';

export const createPostSchema = z.object({
  post_title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  cat1: z.string().min(1, 'Category 1 is required').max(50),
  cat2: z.string().min(1, 'Category 2 is required').max(50),
  post_description: z.string().max(500).optional(),
  post_excerpt: z.string().max(300).optional(),
  post_content: z.string().min(1, 'Content is required'),
  post_tags: z.array(z.string()).default([]),
  post_status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured_image: z.string().url().optional().or(z.literal('')),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
