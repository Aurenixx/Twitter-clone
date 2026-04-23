import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Toggle закладки на посту
export const toggleBookmark = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // 1. Получение текущего пользователя
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser) throw new Error("User not found");

    // 2. Получение поста
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // 3. Проверка, уже ли в закладках
    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_both", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (existingBookmark) {
      // Удаляем из закладок
      await ctx.db.delete(existingBookmark._id);
      return false;
    } else {
      // Добавляем в закладки
      await ctx.db.insert("bookmarks", {
        userId: currentUser._id,
        postId: args.postId,
      });
      return true;
    }
  },
});

// Получение закладок пользователя
export const getBookmarkedPosts = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!currentUser) throw new Error("User not found");

  // Получение всех закладок пользователя
  const bookmarks = await ctx.db
    .query("bookmarks")
    .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
    .collect();

  // Получение полной информации о постах
  return await Promise.all(
    bookmarks.map(async (bookmark) => {
      const post = await ctx.db.get(bookmark.postId);
      if (!post) return null;
      const author = await ctx.db.get(post.userId);
      return {
        ...post,
        author,
      };
    })
  );
});
