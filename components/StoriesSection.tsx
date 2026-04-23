import { View, ScrollView } from "react-native";
import { styles } from "@/styles/feed.styles";
import { Story } from "./Story";
import { STORIES } from "@/constants/mock-data";

export const StoriesSection: React.FC = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      scrollEventThrottle={16}
    >
      {STORIES.map((story) => (
        <Story
          key={story.id}
          username={story.username}
          avatar={story.avatar}
          hasStory={story.hasStory}
        />
      ))}
    </ScrollView>
  );
};
