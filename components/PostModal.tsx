import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import { CommentsModal } from "./CommentsModal";

interface PostModalProps {
  visible: boolean;
  post: any;
  onClose: () => void;
  onLike?: () => void;
  onComment?: (content: string) => void;
  onBookmark?: () => void;
  onDelete?: () => void;
  onFollow?: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  isAuthor: boolean;
  isFollowing?: boolean;
}

export const PostModal: React.FC<PostModalProps> = ({
  visible,
  post,
  onClose,
  onLike,
  onComment,
  onBookmark,
  onDelete,
  onFollow,
  isLiked,
  isBookmarked,
  isAuthor,
  isFollowing: isFollowingProp,
}) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(post?.likes || 0);
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);
  const [commentsCount, setCommentsCount] = useState(post?.comments || 0);
  const [showComments, setShowComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [localFollowing, setLocalFollowing] = useState(isFollowingProp || false);

  if (!post) return null;

  const handleLikeTap = () => {
    setLocalLiked(!localLiked);
    setLocalLikes(prev => !localLiked ? prev + 1 : Math.max(0, prev - 1));
    onLike?.();
  };

  const handleBookmarkTap = () => {
    setLocalBookmarked(!localBookmarked);
    onBookmark?.();
  };

  const handleAddComment = (content: string) => {
    setIsAddingComment(true);
    onComment?.(content);
    setCommentsCount(prev => prev + 1);
    setIsAddingComment(false);
  };

  const handleDeleteTap = () => {
    onDelete?.();
    onClose();
  };

  const handleFollowTap = () => {
    setLocalFollowing(!localFollowing);
    onFollow?.();
  };

  const createdAt = new Date(post._creationTime);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>

            {/* Post Image */}
            <Image
              source={post.imageUrl}
              style={styles.modalImage}
              contentFit="contain"
            />

            {/* Post Info */}
            <View style={styles.modalInfo}>
              {/* Author */}
              <View style={styles.modalAuthor}>
                <Image
                  source={post.author?.image}
                  style={styles.modalAuthorAvatar}
                  contentFit="cover"
                />
                <View style={styles.modalAuthorInfo}>
                  <Text style={styles.modalAuthorName}>{post.author?.username}</Text>
                  <Text style={styles.modalAuthorHandle}>{timeAgo}</Text>
                </View>
                {!isAuthor && (
                  <TouchableOpacity
                    style={[styles.modalFollowButton, localFollowing && { backgroundColor: COLORS.primary }]}
                    onPress={handleFollowTap}
                  >
                    <Text style={[styles.modalFollowText, localFollowing && { color: COLORS.background }]}>
                      {localFollowing ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Caption */}
              {post.caption && (
                <Text style={styles.modalCaption}>{post.caption}</Text>
              )}

              {/* Actions */}
              <View style={styles.modalActions}>
                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={handleLikeTap}
                  >
                    <Ionicons
                      name={localLiked ? "heart" : "heart-outline"}
                      size={24}
                      color={localLiked ? COLORS.primary : COLORS.white}
                    />
                    <Text style={styles.modalActionText}>{localLikes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => setShowComments(true)}
                  >
                    <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
                    <Text style={styles.modalActionText}>{commentsCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={handleBookmarkTap}
                  >
                    <Ionicons
                      name={localBookmarked ? "bookmark" : "bookmark-outline"}
                      size={24}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>

                  {isAuthor && (
                    <TouchableOpacity
                      style={styles.modalActionButton}
                      onPress={handleDeleteTap}
                    >
                      <Ionicons name="trash-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <CommentsModal
        visible={showComments}
        postId={post._id}
        onClose={() => setShowComments(false)}
        onCommentAdded={handleAddComment}
      />
    </>
  );
};