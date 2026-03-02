'use server';

import z from 'zod';
import { postSchema } from './schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth-server';
import { updateTag } from 'next/cache';

// This file contains server actions that can be called from your components to perform server-side logic, such as creating a new blog post. The createBlogAction function takes the form values as input, validates them, uploads the image to storage, creates a new post in the database, and then redirects the user back to the blog page. You can add more actions here for other functionalities like updating or deleting posts, handling comments, etc.
export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error('something went wrong');
    }

    const token = await getToken();
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );

    const uploadResult = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: 'Failed to upload image',
      };
    }

    const { storageId } = await uploadResult.json();
    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch {
    return {
      error: 'Failed to create post',
    };
  }

  updateTag('blog'); // Invalidate the 'blog' cache tag to ensure that the blog list is updated with the new post
  return redirect('/blog');
}
