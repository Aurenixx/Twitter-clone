import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return;
    }

    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});

// Получение текущего аутентифицированного пользователя
export const getAuthenticatedUser = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) throw new Error("User not found");

  return user;
};

// Получение текущего пользователя (query)
export const getCurrentUser = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  return user;
});

// Получение пользователя по Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    return user;
  },
});

// Обновление профиля
export const updateProfile = mutation({
  args: {
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      fullname: args.fullname,
      bio: args.bio,
    });

    return user._id;
  },
});

// Получение профиля пользователя по ID
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    return user;
  },
});

// Проверка подписки
export const isFollowing = query({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser) return false;

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.targetUserId)
      )
      .first();

    return !!follow;
  },
});

// Toggle подписка
export const toggleFollow = mutation({
  args: {
    targetUserId: v.id("users"),
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

    // 2. Получение целевого пользователя
    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) throw new Error("Target user not found");

    // 3. Проверка, уже ли подписаны
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.targetUserId)
      )
      .first();

    if (existingFollow) {
      // Удаляем подписку
      await ctx.db.delete(existingFollow._id);

      // Обновляем счетчики
      await ctx.db.patch(currentUser._id, {
        following: Math.max(0, currentUser.following - 1),
      });

      // Перечитываем актуальное значение targetUser для корректного обновления followers
      const updatedTargetUser = await ctx.db.get(args.targetUserId);
      if (updatedTargetUser) {
        await ctx.db.patch(args.targetUserId, {
          followers: Math.max(0, updatedTargetUser.followers - 1),
        });
      }

      return false;
    } else {
      // Добавляем подписку
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: args.targetUserId,
      });

      // Обновляем счетчики
      await ctx.db.patch(currentUser._id, {
        following: currentUser.following + 1,
      });

      // Перечитываем актуальное значение targetUser для корректного обновления followers
      const updatedTargetUser = await ctx.db.get(args.targetUserId);
      if (updatedTargetUser) {
        await ctx.db.patch(args.targetUserId, {
          followers: updatedTargetUser.followers + 1,
        });
      }

      // Создаем уведомление
      await ctx.db.insert("notifications", {
        receiverId: args.targetUserId,
        senderId: currentUser._id,
        type: "follow",
      });

      // Отправляем push уведомление
      if (updatedTargetUser?.pushToken) {
        await ctx.scheduler.runAfter(
          0,
          internal.pushNotifications.sendPushNotification,
          {
            pushToken: updatedTargetUser.pushToken,
            title: "Новий підписник 👤",
            body: `${currentUser.username} підписався на вас`,
            data: { userId: currentUser._id },
          },
        );
      }
      return true;
    }
  },
});

export const savePushToken = mutation({
  args: {
    pushToken: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    await ctx.db.patch(currentUser._id, {
      pushToken: args.pushToken,
    });
  },
});