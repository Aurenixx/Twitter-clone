import { View, Text } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  author: {
    _id: string;
    username: string;
    image: string;
  };
  content: string;
  _creationTime: number;
}

export const Comment: React.FC<CommentProps> = ({
  author,
  content,
  _creationTime,
}) => {
  const createdAt = new Date(_creationTime);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <View style={styles.commentContainer}>
      <Image
        source={author?.image}
        style={styles.commentAvatar}
        contentFit="cover"
      />
      <View style={styles.commentContent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.commentAuthor}>{author?.username}</Text>
          <Text style={{ fontSize: 12, color: COLORS.grey }}>{timeAgo}</Text>
        </View>
        <Text style={styles.commentText}>{content}</Text>
      </View>
    </View>
  );
};
