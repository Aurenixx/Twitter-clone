import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.whiteLight,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  note: {
    color: COLORS.greyDark,
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
  },
});
