import { SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { usePushNotifications } from "@/hooks/usePushNotifications";

function AppContent() {
  usePushNotifications();
  return <InitialLayout />;
}

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <AppContent />
      </SafeAreaView>
    </ClerkAndConvexProvider>
  );
}
