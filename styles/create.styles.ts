import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

// Получаем ширину экрана для квадратного изображения
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // ========== КОНТЕЙНЕРЫ ==========
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentDisabled: {
    opacity: 0.6,
  },

  // ========== HEADER ==========
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.grey,
  },

  // ========== КНОПКА SHARE ==========
  shareButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  shareTextDisabled: {
    color: COLORS.white,
  },

  // ========== СОСТОЯНИЕ БЕЗ ИЗОБРАЖЕНИЯ ==========
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  emptyImageText: {
    color: COLORS.greyDark,
    fontSize: 17,
    fontWeight: "500",
  },

  // ========== СЕКЦИЯ ИЗОБРАЖЕНИЯ ==========
  imageSection: {
    width: width,
    height: width * 0.8,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // ========== СЕКЦИЯ ВВОДА ==========
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    marginTop: 4,
  },
  captionInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "500",
    paddingTop: 0,
    minHeight: 50,
  },
});
