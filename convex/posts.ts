import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Генерация URL для загрузки файла
export const generateUploadUrl = mutation(async (ctx) => {
  // Проверка аутентификации
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  
  // Генерация подписанного URL (действителен ~1 час)
  return await ctx.storage.generateUploadUrl();
});

// Создание поста в базе данных
export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),    // Текст твита (необязательный)
    storageId: v.id("_storage"),        // ID файла в Storage
  },
  handler: async (ctx, args) => {
    // 1. Проверка аутентификации
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // 2. Поиск пользователя в БД
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!currentUser) throw new Error("User not found");

    // 3. Получение публичного URL изображения
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image URL not found");

    // 4. Создание поста
    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    // 5. Обновление счетчика постов пользователя
    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });
    
    return postId;
  },
});

// Получение всех постов с информацией об авторе и статусах
export const getPosts = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  
  let currentUser = null;
  if (identity) {
    currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  }
  
  // Получение всех постов, упорядоченных по убыванию
  const posts = await ctx.db
    .query("posts")
    .order("desc")
    .collect();

  // Обогащение данных каждого поста
  return await Promise.all(
    posts.map(async (post) => {
      // 1. Получение информации об авторе
      const author = await ctx.db.get(post.userId);

      // 2. Проверка, лайкнул ли текущий пользователь
      let isLiked = false;
      if (currentUser) {
        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();
        isLiked = !!like;
      }

      // 3. Проверка, в закладках ли пост
      let isBookmarked = false;
      if (currentUser) {
        const bookmark = await ctx.db
          .query("bookmarks")
          .withIndex("by_both", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();
        isBookmarked = !!bookmark;
      }

      // 4. Проверка, является ли текущий пользователь автором
      const isAuthor = currentUser ? currentUser._id === post.userId : false;

      return {
        ...post,
        author,
        isLiked,
        isBookmarked,
        isAuthor,
      };
    })
  );
});

// Toggle лайка на посту
export const toggleLike = mutation({
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

    // 3. Проверка, уже ли лайкнут
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (existingLike) {
      // Удаляем лайк
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, { likes: Math.max(0, post.likes - 1) });
      return false;
    } else {
      // Добавляем лайк
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(args.postId, { likes: post.likes + 1 });

      // Создание уведомления (если это не свой пост)
      if (post.userId !== currentUser._id) {
        await ctx.db.insert("notifications", {
          receiverId: post.userId,
          senderId: currentUser._id,
          type: "like",
          postId: args.postId,
        });

        // Отправка push уведомления
        const postOwner = await ctx.db.get(post.userId);
        if (postOwner?.pushToken) {
          await ctx.scheduler.runAfter(
            0,
            internal.pushNotifications.sendPushNotification,
            {
              pushToken: postOwner.pushToken,
              title: "Новий лайк ❤️",
              body: `${currentUser.username} лайкнул ваш пост`,
              data: { postId: args.postId },
            }
          );
        }
      }

      return true;
    }
  },
});

// Удаление поста
export const deletePost = mutation({
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

    // 3. Проверка, что пост принадлежит текущему пользователю
    if (post.userId !== currentUser._id) {
      throw new Error("Forbidden");
    }

    // 4. Удаление всех лайков к посту
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // 5. Удаление всех коментариев к посту
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // 6. Удаление всех закладок к посту
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    // 7. Удаление всех уведомлений к посту
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    // 8. Удаление файла из хранилища
    if (post.storageId) {
      await ctx.storage.delete(post.storageId);
    }

    // 9. Удаление самого поста
    await ctx.db.delete(args.postId);

    // 10. Обновление счетчика постов пользователя
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, currentUser.posts - 1),
    });

    return true;
  },
});

// Получение постов определенного пользователя
export const getPostsByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        return {
          ...post,
          author,
        };
      })
    );
  },
});

