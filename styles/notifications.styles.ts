import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  // ========== КОНТЕЙНЕР ==========
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ========== HEADER ==========
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
  },

  // ========== LOADER ==========
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ========== EMPTY STATE ==========
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 17,
    color: COLORS.greyDark,
    fontWeight: "500",
  },

  // ========== NOTIFICATION ITEM ==========
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  notificationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -6,
    right: -6,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  notificationText: {
    fontSize: 15,
    color: COLORS.white,
    lineHeight: 22,
    fontWeight: "400",
  },
  notificationTime: {
    fontSize: 13,
    color: COLORS.greyDark,
    marginTop: 6,
  },

  // ========== GRID ==========
  gridContainer: {
    flex: 1,
    paddingHorizontal: 2,
  },
  gridImage: {
    flex: 1,
    height: 120,
    margin: 2,
    borderRadius: 8,
  },

  // ========== NO CONTENT ==========
  noContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  noContentText: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: "center",
  },
});
