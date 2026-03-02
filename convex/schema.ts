import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// This is the schema for our Convex database. It defines two tables: posts and comments. The posts table has a search index on the title and body fields, which allows us to perform full-text search on those fields. The comments table has a reference to the postId, which allows us to fetch all comments for a given post.
export default defineSchema({
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
  })
    .searchIndex('search_title', {
      searchField: 'title',
    })
    .searchIndex('search_body', {
      searchField: 'body',
    }),
  comments: defineTable({
    postId: v.id('posts'),
    authorId: v.string(),
    authorName: v.string(),
    body: v.string(),
  }),
});
