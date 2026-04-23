import { View, Text, StatusBar, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { Loader } from "@/components/Loader";
import { NotificationItem } from "@/components/NotificationItem";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const notifications = useQuery(api.notifications.getNotifications);
  const currentUser = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  const handleNotificationPress = (notification: any) => {
    // TODO: Navigate to post or profile
    console.log("Notification pressed:", notification);
  };

  const handleAvatarPress = (senderId: string) => {
    if (currentUser?._id === senderId) {
      router.push("/profile");
    } else {
      router.push(`/user/${senderId}`);
    }
  };

  if (notifications === undefined) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Loader />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={48} color={COLORS.grey} />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(notification) => notification._id}
        renderItem={({ item: notification }) => (
          <NotificationItem
            type={notification.type}
            sender={notification.sender}
            _creationTime={notification._creationTime}
            onPress={() => handleNotificationPress(notification)}
            onAvatarPress={() => handleAvatarPress(notification.senderId)}
          />
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
