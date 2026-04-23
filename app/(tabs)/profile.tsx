import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth, useUser } from "@clerk/expo";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/profile.styles";
import { Loader } from "@/components/Loader";
import { useState, useEffect, useCallback } from "react";
import { PostModal } from "@/components/PostModal";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const convex = useConvex();
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editBio, setEditBio] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const updateProfile = useMutation(api.users.updateProfile);
  const currentUser = useQuery(api.users.getCurrentUser);
  const userPosts = useQuery(api.posts.getPostsByUser, currentUser ? { userId: currentUser._id } : "skip");

  // Force refetch when component mounts or when forceUpdate changes
  useEffect(() => {
    convex.query(api.users.getCurrentUser).catch(console.error);
  }, [forceUpdate, convex]);

  // Additional refetch on mount
  useEffect(() => {
    convex.query(api.users.getCurrentUser).catch(console.error);
  }, [convex]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      convex.query(api.users.getCurrentUser).catch(console.error);
      setForceUpdate(prev => prev + 1);
    }, [convex])
  );

  // Force refetch when component mounts or when forceUpdate changes
  useEffect(() => {
    convex.query(api.users.getCurrentUser).catch(console.error);
  }, [forceUpdate, convex]);

  // Additional refetch on mount
  useEffect(() => {
    convex.query(api.users.getCurrentUser).catch(console.error);
  }, [convex]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      convex.query(api.users.getCurrentUser).catch(console.error);
      setForceUpdate(prev => prev + 1);
    }, [convex])
  );

  // Periodic refetch to catch any missed updates
  useEffect(() => {
    const interval = setInterval(() => {
      convex.query(api.users.getCurrentUser).catch(console.error);
      setForceUpdate(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [convex]);

  // Force refetch when component mounts or when forceUpdate changes
  useEffect(() => {
    convex.query(api.users.getCurrentUser).catch(console.error);
  }, [forceUpdate, convex]);

  // Additional refetch on mount
  useEffect(() => {
    convex.query(api.users.getCurrentUser).catch(console.error);
  }, [convex]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        fullname: editName,
        bio: editBio,
      });
      setShowEditModal(false);
      setForceUpdate(prev => prev + 1); // Refresh after save
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Loader />
      </View>
    );
  }

  if (userPosts === undefined) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{user.firstName}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut()}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Loader />
      </View>
    );
  }

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user.firstName}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => signOut()}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <Image
            source={user.imageUrl}
            style={styles.profileAvatar}
            contentFit="cover"
          />
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.profileName}>{user.fullName}</Text>
        <Text style={styles.profileHandle}>@{user.username}</Text>
        <Text style={styles.profileBio}>{editBio || "No bio"}</Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser?.following || 0}</Text>
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
      <View key={forceUpdate} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FlatList
          data={userPosts}
          keyExtractor={(post) => post._id}
          renderItem={renderPost}
          ListHeaderComponent={renderHeader}
          numColumns={3}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.editSheet}
          >
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.editInput}
              placeholder="Full Name"
              placeholderTextColor={COLORS.grey}
              value={editName}
              onChangeText={setEditName}
            />

            <TextInput
              style={[styles.editInput, { minHeight: 80 }]}
              placeholder="Bio"
              placeholderTextColor={COLORS.grey}
              value={editBio}
              onChangeText={setEditBio}
              multiline
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Post Modal */}
      <PostModal
        visible={showPostModal}
        post={selectedPost}
        onClose={() => setShowPostModal(false)}
        isLiked={false} // TODO: check if liked
        isBookmarked={false} // TODO: check if bookmarked
        isAuthor={true} // current user's profile
      />
    </>
  );
}
