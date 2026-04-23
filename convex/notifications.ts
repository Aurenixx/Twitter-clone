import { query } from "./_generated/server";

// Получение уведомлений текущего пользователя
export const getNotifications = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!currentUser) throw new Error("User not found");

  // Получение всех уведомлений
  const notifications = await ctx.db
    .query("notifications")
    .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
    .order("desc")
    .collect();

  // Обогащение уведомлений информацией об отправителе и посте
  return await Promise.all(
    notifications.map(async (notification) => {
      const sender = await ctx.db.get(notification.senderId);
      const post = notification.postId ? await ctx.db.get(notification.postId) : null;
      const comment = notification.commentId ? await ctx.db.get(notification.commentId) : null;

      return {
        ...notification,
        sender,
        post,
        comment,
      };
    })
  );
});
