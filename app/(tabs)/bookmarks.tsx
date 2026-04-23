import { View, Text, StatusBar, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { Loader } from "@/components/Loader";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

export default function BookmarksScreen() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  if (bookmarkedPosts === undefined) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookmarks</Text>
        </View>
        <Loader />
      </View>
    );
  }

  if (bookmarkedPosts.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookmarks</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={48} color={COLORS.grey} />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      <FlatList
        data={bookmarkedPosts}
        keyExtractor={(post) => post._id}
        renderItem={({ item: post }) => (
          <Image
            source={post.imageUrl}
            style={styles.gridImage}
            contentFit="cover"
          />
        )}
        numColumns={3}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}
