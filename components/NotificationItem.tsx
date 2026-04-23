import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  type: "like" | "comment" | "follow";
  sender: {
    _id: string;
    username: string;
    image: string;
  };
  _creationTime: number;
  onPress?: () => void;
  onAvatarPress?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  sender,
  _creationTime,
  onPress,
  onAvatarPress,
}) => {
  const createdAt = new Date(_creationTime);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  const getNotificationText = () => {
    switch (type) {
      case "like":
        return `${sender.username} liked your post`;
      case "comment":
        return `${sender.username} commented on your post`;
      case "follow":
        return `${sender.username} started following you`;
      default:
        return "";
    }
  };

  const getNotificationIcon = () => {
    switch (type) {
      case "like":
        return "heart";
      case "comment":
        return "chatbubble";
      case "follow":
        return "person-add";
      default:
        return "notifications";
    }
  };

  return (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={onAvatarPress}
      >
        <Image
          source={sender.image}
          style={styles.notificationAvatar}
          contentFit="cover"
        />
        <View style={styles.notificationBadge}>
          <Ionicons
            name={getNotificationIcon()}
            size={14}
            color={COLORS.white}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{getNotificationText()}</Text>
        <Text style={styles.notificationTime}>{timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
};
