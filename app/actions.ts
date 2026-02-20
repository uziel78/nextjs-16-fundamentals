'use server';

import { postSchema } from './schemas/blog';
import z from 'zod';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth-server';

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  // add server-side validation
  const parsed = postSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error('Something went wrong!');
  }

  const token = await getToken();

  // call the mutation using fetchMutation (see convex documentation for more details: https://docs.convex.dev/nextjs/server-actions#calling-mutations-from-server-actions)
  await fetchMutation(
    api.posts.createPost,
    {
      body: parsed.data.content,
      title: parsed.data.title,
    },
    { token },
  );

  return redirect('/');
}
