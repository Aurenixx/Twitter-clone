import { View, Text } from "react-native";
import { Image } from "expo-image";
import { styles } from "@/styles/feed.styles";

interface StoryProps {
  username: string;
  avatar: string;
  hasStory: boolean;
}

export const Story: React.FC<StoryProps> = ({ username, avatar, hasStory }) => {
  return (
    <View style={styles.storyWrapper}>
      <View
        style={[
          styles.storyRing,
          hasStory ? styles.storyRingActive : styles.storyRingInactive,
        ]}
      >
        <Image source={avatar} style={styles.storyImage} contentFit="cover" />
      </View>
      <Text numberOfLines={1} style={styles.storyName}>
        {username}
      </Text>
    </View>
  );
};
