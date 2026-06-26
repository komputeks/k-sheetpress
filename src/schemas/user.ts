import { z } from 'zod/v4';

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'),
  display_name: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
