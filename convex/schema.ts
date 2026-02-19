import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  posts: defineTable({
    body: v.string(),
    title: v.string(),
    authorId: v.string(),
  }),
});
