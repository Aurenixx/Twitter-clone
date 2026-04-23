import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");
const imageSize = width; // Квадратное изображение

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
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.5,
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

  // ========== STORIES ==========
  storiesContainer: {
    height: 110,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    backgroundColor: COLORS.background,
  },
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 6,
  },
  storyRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 3,
  },
  storyRingActive: {
    borderColor: COLORS.primary,
  },
  storyRingInactive: {
    borderColor: COLORS.surfaceLighter,
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  storyName: {
    fontSize: 11,
    color: COLORS.whiteLight,
    textAlign: "center",
    fontWeight: "500",
  },

  // ========== POSTS ==========
  postsContainer: {
    flex: 1,
  },
  post: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    paddingVertical: 12,
  },

  // Post Header
  postHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  postAuthorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  postAuthorInfo: {
    flex: 1,
    justifyContent: "center",
  },
  postAuthorName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  postAuthorHandle: {
    fontSize: 13,
    color: COLORS.greyDark,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },

  // Post Image
  postImage: {
    width: imageSize,
    height: imageSize * 0.75,
    backgroundColor: COLORS.surface,
    marginVertical: 8,
  },

  // Post Actions
  postActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-around",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.greyDark,
    fontWeight: "500",
  },

  // Post Caption
  postCaption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postCaptionText: {
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },

  // ========== LOADER ==========
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ========== MODAL (Comments) ==========
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  commentSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  commentHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  commentCloseButton: {
    padding: 8,
  },
  commentList: {
    flexGrow: 1,
  },
  commentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
    flexDirection: "row",
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.whiteLight,
    marginTop: 6,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    gap: 12,
    backgroundColor: COLORS.background,
  },
  commentAvatar2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginTop: 2,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    marginTop: 4,
  },

  // ========== POST MODAL ==========
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  modalImage: {
    width: "100%",
    height: "60%",
  },
  modalInfo: {
    flex: 1,
    padding: 16,
  },
  modalAuthor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalAuthorInfo: {
    flex: 1,
  },
  modalAuthorName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  modalAuthorHandle: {
    fontSize: 14,
    color: COLORS.grey,
  },
  modalFollowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
  },
  modalFollowText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  modalCaption: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 22,
    marginBottom: 16,
  },
  modalActions: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalActionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  modalActionText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },
});
