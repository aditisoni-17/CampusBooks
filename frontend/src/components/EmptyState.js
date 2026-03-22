import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/constants";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <View style={styles.container}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 28,
  },
  icon: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
});
