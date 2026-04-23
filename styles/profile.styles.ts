import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  // ========== PROFILE INFO ==========
  profileInfo: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
  },
  profileActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 4,
    paddingHorizontal: 16,
    marginTop: -8,
  },
  profileHandle: {
    fontSize: 14,
    color: COLORS.greyDark,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  profileBio: {
    fontSize: 14,
    color: COLORS.whiteLight,
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  // ========== STATS ==========
  stats: {
    flexDirection: "row",
    gap: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 4,
  },

  // ========== POSTS GRID ==========
  gridContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  gridImage: {
    flex: 1,
    height: (width - 12) / 3,
    margin: 4,
    borderRadius: 4,
  },
  noPostsContainer: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    color: COLORS.grey,
    fontSize: 14,
    textAlign: "center",
  },

  // ========== LOADER ==========
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ========== EDIT MODAL ==========
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    maxHeight: "80%",
  },
  editHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  editInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: "600",
  },
});
