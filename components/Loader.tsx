import { View, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";

export const Loader: React.FC = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};
