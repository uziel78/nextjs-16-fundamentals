import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';

// This file defines a query to get comments for a specific post. The query takes a postId as an argument and returns the comments for that post. You can modify the query to filter comments by postId and return only the relevant comments for that post.
export const getCommentsByPostId = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query('comments')
      .filter((q) => q.eq(q.field('postId'), args.postId))
      .order('desc')
      .collect();

    return data;
  },
});

// This mutation allows authenticated users to create a comment on a specific post. It takes the comment body and the postId as arguments, checks if the user is authenticated, and then inserts the new comment into the database with the associated postId and author information.
export const createComment = mutation({
  args: {
    body: v.string(),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }

    return await ctx.db.insert('comments', {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});
