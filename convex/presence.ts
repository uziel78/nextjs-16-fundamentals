import { mutation, query } from './_generated/server';
import { components } from './_generated/api';
import { ConvexError, v } from 'convex/values';
import { Presence } from '@convex-dev/presence';
import { authComponent } from './auth';

// This file defines the Convex API routes for managing presence in a chat room. It includes a Presence instance that handles the logic for tracking user presence, as well as three API routes: heartbeat, list, and disconnect. The heartbeat route is called by clients to indicate that they are still active, the list route returns the current presence information for a given room, and the disconnect route is called when a client disconnects to clean up their presence information.
export const presence = new Presence(components.presence);

// The heartbeat route is called by clients to indicate that they are still active. It takes the roomId, userId, sessionId, and interval as arguments and calls the presence.heartbeat method to update the presence information for the user in the specified room.
export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    // TODO: Add your auth checks here.

    // In this example, we use the authComponent to safely get the authenticated user from the context and check if their user ID matches the userId provided in the heartbeat request. If there is no authenticated user or if the user ID does not match, we throw an unauthorized error. This ensures that only authenticated users can update their presence information for a room.
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user || user._id !== userId) {
      throw new ConvexError('Unauthorized');
    }

    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

// The list route returns the current presence information for a given room. It takes the roomToken as an argument and calls the presence.list method to retrieve the presence information for all users in the specified room.
export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const entries = await presence.list(ctx, roomToken);
    return await Promise.all(
      entries.map(async (entry) => {
        const user = await authComponent.getAnyUserById(ctx, entry.userId);

        if (!user) {
          return entry;
        }

        return {
          ...entry,
          name: user.name,
        };
      }),
    );
    // Avoid adding per-user reads so all subscriptions can share same cache.
    //return await presence.list(ctx, roomToken);
  },
});

// The disconnect route is called when a client disconnects to clean up their presence information. It takes the sessionToken as an argument and calls the presence.disconnect method to remove the user's presence information from the specified session.
export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // Can't check auth here because it's called over http from sendBeacon.
    return await presence.disconnect(ctx, sessionToken);
  },
});

// The getUserId route is a query that retrieves the user ID of the currently authenticated user. It uses the authComponent to safely get the authenticated user from the context and returns their user ID. If there is no authenticated user, it returns null.
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    return user?._id;
  },
});
