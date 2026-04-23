import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/profile.styles";
import { Loader } from "@/components/Loader";
import { useState, useEffect } from "react";
import { PostModal } from "@/components/PostModal";

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [isFollowingState, setIsFollowingState] = useState<boolean | undefined>(undefined);
  const [isToggling, setIsToggling] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const userProfile = useQuery(
    api.users.getUserProfile,
    id ? { userId: id as string } : "skip"
  );

  const isFollowingQuery = useQuery(
    api.users.isFollowing,
    id ? { targetUserId: id as string } : "skip"
  );

  const userPosts = useQuery(
    api.posts.getPostsByUser,
    id ? { userId: id as string } : "skip"
  );

  const toggleFollow = useMutation(api.users.toggleFollow);

  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (isFollowingQuery !== undefined) {
      setIsFollowingState(isFollowingQuery);
    }
  }, [isFollowingQuery]);

  const handleToggleFollow = async () => {
    if (!id) return;
    setIsToggling(true);
    try {
      const result = await toggleFollow({ targetUserId: id as string });
      if (Platform.OS === "android" || Platform.OS === "ios") {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setIsFollowingState(result);
      setProfileData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: prev.followers + (result ? 1 : -1),
        };
      });
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsToggling(false);
    }
  };

  if (userProfile === undefined || isFollowingQuery === undefined || userPosts === undefined) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Loader />
      </View>
    );
  }

  const currentIsFollowing = isFollowingState ?? isFollowingQuery ?? false;
  const currentProfile = profileData ?? userProfile;

  if (!currentProfile) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Loader />
      </View>
    );
  }

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userProfile.username}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <Image
            source={currentProfile.image}
            style={styles.profileAvatar}
            contentFit="cover"
          />
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                currentIsFollowing && { backgroundColor: COLORS.primary },
              ]}
              onPress={handleToggleFollow}
              disabled={isToggling}
            >
              {isToggling ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text
                  style={[
                    styles.actionButtonText,
                    currentIsFollowing && { color: COLORS.background },
                  ]}
                >
                  {currentIsFollowing ? "Following" : "Follow"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.profileName}>{currentProfile.fullname}</Text>
        <Text style={styles.profileHandle}>@{currentProfile.username}</Text>
        <Text style={styles.profileBio}>{currentProfile.bio || "No bio"}</Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentProfile.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentProfile.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderPost = ({ item: post }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedPost(post);
        setShowPostModal(true);
      }}
    >
      <Image
        source={post.imageUrl}
        style={styles.gridImage}
        contentFit="cover"
      />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FlatList
          data={userPosts}
          keyExtractor={(post) => post._id}
          renderItem={renderPost}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>No posts yet</Text>
            </View>
          }
          numColumns={3}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* Post Modal */}
      <PostModal
        visible={showPostModal}
        post={selectedPost}
        onClose={() => setShowPostModal(false)}
        isLiked={false} // TODO: check if liked
        isBookmarked={false} // TODO: check if bookmarked
        isAuthor={false} // other user's profile
        isFollowing={isFollowingQuery}
        onFollow={handleToggleFollow}
      />
    </>
  );
}
