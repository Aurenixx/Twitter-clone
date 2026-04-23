import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Добавление коментария к посту
export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
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

    // 3. Создание коментария
    const commentId = await ctx.db.insert("comments", {
      userId: currentUser._id,
      postId: args.postId,
      content: args.content,
    });

    // 4. Обновление счетчика коментариев
    await ctx.db.patch(args.postId, {
      comments: post.comments + 1,
    });

    // 5. Создание уведомления (если это не свой пост)
    if (post.userId !== currentUser._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });
    }

    // 6. Отправка push уведомления
    const postOwner = await ctx.db.get(post.userId);
    if (postOwner?.pushToken) {
      await ctx.scheduler.runAfter(
        0,
        internal.pushNotifications.sendPushNotification,
        {
          pushToken: postOwner.pushToken,
          title: "Новий коментар 💬",
          body: `${currentUser.username}: ${args.content}`,
          data: { postId: args.postId },
        }
      );
    }

    return commentId;
  },
});

// Получение коментариев поста
export const getComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Обогащение каждого коментария информацией об авторе
    return await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.userId);
        return {
          ...comment,
          author,
        };
      })
    );
  },
});
