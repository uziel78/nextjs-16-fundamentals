import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';

// Create a new task with the given text
export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }
    // Insert the new blog post into the database, associating it with the authenticated user's ID as the author
    const blogArticle = await ctx.db.insert('posts', {
      body: args.body,
      title: args.title,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });
    return blogArticle;
  },
});

// Get all tasks, sorted by most recent first
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('posts').order('desc').collect();

    // For each post, if it has an imageStorageId, get the URL for that image from storage and include it in the returned object
    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;
        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      }),
    );
  },
});

// Generate an upload URL for the client to upload an image to storage
export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }

    return await ctx.storage.generateUploadUrl();
  },
});
