import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { useAuth } from "@clerk/expo";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { Post } from "@/components/Post";
import { Loader } from "@/components/Loader";
import { StoriesSection } from "@/components/StoriesSection";
import { useRouter } from "expo-router";
import { PostModal } from "@/components/PostModal";
import { useState } from "react";

export default function FeedScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const posts = useQuery(api.posts.getPosts);
  const currentUser = useQuery(api.users.getCurrentUser);
  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const addComment = useMutation(api.comments.addComment);
  const deletePost = useMutation(api.posts.deletePost);
  const toggleFollow = useMutation(api.users.toggleFollow);

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const handleLike = (postId: any) => {
    toggleLike({ postId }).catch((error) => {
      console.error("Error liking post:", error);
    });
  };

  const handleComment = (postId: any, content: string) => {
    addComment({ postId, content }).catch((error) => {
      console.error("Error adding comment:", error);
    });
  };

  const handleBookmark = (postId: any) => {
    toggleBookmark({ postId }).catch((error) => {
      console.error("Error bookmarking post:", error);
    });
  };

  const handleDelete = (postId: any) => {
    deletePost({ postId }).catch((error) => {
      console.error("Error deleting post:", error);
    });
  };

  const handleAvatarPress = (userId: string) => {
    if (currentUser?._id === userId) {
      router.push("/profile");
    } else {
      router.push(`/user/${userId}`);
    }
  };

  const handleFollow = (userId: any) => {
    toggleFollow({ targetUserId: userId }).catch((error) => {
      console.error("Error following user:", error);
    });
  };

  const handlePostPress = (post: any) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>X</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => signOut()}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPost = ({ item: post }: { item: any }) => (
    <Post
      _id={post._id}
      imageUrl={post.imageUrl}
      caption={post.caption}
      likes={post.likes}
      comments={post.comments}
      _creationTime={post._creationTime}
      author={post.author}
      isLiked={post.isLiked}
      isBookmarked={post.isBookmarked}
      isAuthor={post.isAuthor}
      onLike={() => handleLike(post._id)}
      onComment={(content) => handleComment(post._id, content)}
      onBookmark={() => handleBookmark(post._id)}
      onDelete={() => handleDelete(post._id)}
      onAvatarPress={() => handleAvatarPress(post.author._id)}
      onImagePress={() => handlePostPress(post)}
    />
  );

  if (posts === undefined) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {renderHeader()}
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={posts}
        keyExtractor={(post) => post._id}
        renderItem={renderPost}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <StoriesSection />
          </>
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      {/* Post Modal */}
      <PostModal
        visible={showPostModal}
        post={selectedPost}
        onClose={() => setShowPostModal(false)}
        onLike={() => handleLike(selectedPost?._id)}
        onComment={(content) => handleComment(selectedPost?._id, content)}
        onBookmark={() => handleBookmark(selectedPost?._id)}
        onDelete={() => handleDelete(selectedPost?._id)}
        isLiked={selectedPost?.isLiked}
        isBookmarked={selectedPost?.isBookmarked}
        isAuthor={selectedPost?.isAuthor}
        onFollow={() => handleFollow(selectedPost?.author._id)}
      />
    </View>
  );
}
