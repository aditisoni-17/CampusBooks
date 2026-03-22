import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/constants";

export default function SearchBadge({ label, value, tone = "default" }) {
  const toneStyle =
    tone === "success"
      ? styles.success
      : tone === "warning"
        ? styles.warning
        : styles.default;

  return (
    <View style={[styles.badge, toneStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  default: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
  },
  success: {
    backgroundColor: "#E8F5E9",
    borderColor: COLORS.success,
  },
  warning: {
    backgroundColor: "#FFF4E5",
    borderColor: COLORS.warning,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  value: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
});
