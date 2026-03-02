import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';
import { Doc } from './_generated/dataModel';

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

// Get a single post by its ID, including the resolved image URL if it has an associated image
export const getPostById = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      return null;
    }

    const resolvedImageUrl =
      post?.imageStorageId !== undefined
        ? await ctx.storage.getUrl(post.imageStorageId)
        : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl,
    };
  },
});

// This is the searchPosts query, which allows us to perform a full-text search on the posts in our database. It takes a search term and a limit as arguments, and returns an array of posts that match the search term in either the title or body fields. The search is performed using the search indexes we defined in our schema, which allows for efficient full-text search on those fields.
interface searchResultTypes {
  _id: string;
  title: string;
  body: string;
}

export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const results: Array<searchResultTypes> = [];

    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<'posts'>>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        });
        if (results.length >= limit) break;
      }
    };

    const titleMatches = await ctx.db
      .query('posts')
      .withSearchIndex('search_title', (q) => q.search('title', args.term))
      .take(limit);

    await pushDocs(titleMatches);

    if (results.length < limit) {
      const bodyMatches = await ctx.db
        .query('posts')
        .withSearchIndex('search_body', (q) => q.search('body', args.term))
        .take(limit);

      await pushDocs(bodyMatches);
    }

    return results;
  },
});
