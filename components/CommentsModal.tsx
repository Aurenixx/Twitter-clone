import {
  View,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { Comment } from "./Comment";
import { useState } from "react";

interface CommentsModalProps {
  visible: boolean;
  postId: any;
  onClose: () => void;
  onAddComment: (content: string) => void;
  isAdding?: boolean;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  postId,
  onClose,
  onAddComment,
  isAdding = false,
}) => {
  const { user } = useUser();
  const [commentText, setCommentText] = useState("");
  const comments = useQuery(api.comments.getComments, { postId });

  const handleSendComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.commentSheet}>
          {/* Header */}
          <View style={styles.commentHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments === undefined ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(comment) => comment._id}
              renderItem={({ item: comment }) => (
                <Comment
                  author={comment.author || { _id: "", username: "Unknown", image: "" }}
                  content={comment.content}
                  _creationTime={comment._creationTime}
                />
              )}
              contentContainerStyle={styles.commentList}
              scrollEventThrottle={16}
            />
          )}

          {/* Input Section */}
          <View style={styles.commentInputContainer}>
            <Image
              source={user?.imageUrl}
              style={styles.commentAvatar2}
              contentFit="cover"
            />
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={COLORS.grey}
              value={commentText}
              onChangeText={setCommentText}
              editable={!isAdding}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendComment}
              disabled={isAdding || !commentText.trim()}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={commentText.trim() ? COLORS.primary : COLORS.grey}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
