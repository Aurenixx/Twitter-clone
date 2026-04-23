import { useConvexAuth } from "convex/react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";

export default function InitialLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthScreen = segments[0] === "(auth)";

    if (isAuthenticated && inAuthScreen) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthScreen) {
      router.replace("/(auth)/login");
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
