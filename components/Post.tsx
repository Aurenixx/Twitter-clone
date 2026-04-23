import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import { CommentsModal } from "./CommentsModal";

interface PostProps {
  _id: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  _creationTime: number;
  author: {
    _id: string;
    username: string;
    image: string;
  };
  isLiked: boolean;
  isBookmarked: boolean;
  isAuthor?: boolean;
  onLike?: () => void;
  onComment?: (content: string) => void;
  onBookmark?: () => void;
  onDelete?: () => void;
  onAvatarPress?: () => void;
  onImagePress?: () => void;
}

export const Post: React.FC<PostProps> = ({
  _id,
  imageUrl,
  caption,
  likes,
  comments,
  _creationTime,
  author,
  isLiked,
  isBookmarked,
  isAuthor,
  onLike,
  onComment,
  onBookmark,
  onDelete,
  onAvatarPress,
  onImagePress,
}) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);
  const [commentsCount, setCommentsCount] = useState(comments);
  const [showComments, setShowComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

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
  };

  const createdAt = new Date(_creationTime);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <>
      <View style={styles.post}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <TouchableOpacity onPress={onAvatarPress}>
              <Image
                source={author?.image}
                style={styles.postAuthorAvatar}
                contentFit="cover"
              />
            </TouchableOpacity>
            <View style={styles.postAuthorInfo}>
              <Text style={styles.postAuthorName}>{author?.username}</Text>
              <Text style={styles.postAuthorHandle}>{timeAgo}</Text>
            </View>
          </View>
          {isAuthor && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteTap}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Post Image */}
        <TouchableOpacity onPress={onImagePress}>
          <Image
            source={imageUrl}
            style={styles.postImage}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLikeTap}>
            <Ionicons
              name={localLiked ? "heart" : "heart-outline"}
              size={20}
              color={localLiked ? COLORS.primary : COLORS.grey}
            />
            <Text style={styles.actionButtonText}>{localLikes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowComments(true)}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.grey} />
            <Text style={styles.actionButtonText}>{commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBookmarkTap}
          >
            <Ionicons
              name={localBookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={localBookmarked ? COLORS.primary : COLORS.grey}
            />
          </TouchableOpacity>
        </View>

        {/* Post Caption */}
        {caption && (
          <View style={styles.postCaption}>
            <Text style={styles.postCaptionText}>{caption}</Text>
          </View>
        )}
      </View>

      {/* Comments Modal */}
      <CommentsModal
        visible={showComments}
        postId={_id}
        onClose={() => setShowComments(false)}
        onAddComment={handleAddComment}
        isAdding={isAddingComment}
      />
    </>
  );
};
