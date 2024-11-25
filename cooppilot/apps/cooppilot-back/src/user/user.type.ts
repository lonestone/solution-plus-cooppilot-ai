import { z } from 'zod';

export const userSchema = z.object({
  id: z.coerce.string(),
  email: z.string(),
  name: z.string(),
  country: z.string(),
  company: z.string(),
});

export type User = z.infer<typeof userSchema>;

export function getAuthFromUser(user: User): HeadersInit {
  return {
    'x-auth-method': 'api-key',
    // TODO replace with env var
    'x-auth-api-key': 'Wd01fzebHN7ZKNjdUw8FyRjm1KvrDZBa',
    // Will act on behalf the following user
    'x-user-id': user.id,
    'x-user-email': user.email,
    'x-user-name': user.name,
    'x-user-metadata': JSON.stringify({
      email: user.email,
      country: user.country,
      company: user.company,
    } satisfies UserMetadata),
  };
}

export const userMetadataSchema = z.object({
  email: z.string().optional(),
  country: z.string().optional(),
  company: z.string().optional(),
});

export type UserMetadata = z.infer<typeof userMetadataSchema>;
