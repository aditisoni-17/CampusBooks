import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../utils/constants";

export default function BookCard({
  title,
  author,
  badges = [],
  price,
  imageUri,
  onPress,
  footer,
  rightAction,
  compact = false,
}) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <TouchableOpacity
        style={styles.info}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>

        {badges.length > 0 && (
          <View style={styles.badges}>
            {badges.map((badge) => (
              <Text key={`${badge.label}-${badge.value}`} style={[styles.badge, badge.style]}>
                {badge.label}
              </Text>
            ))}
          </View>
        )}

        {price > 0 && <Text style={styles.price}>₹{price}</Text>}
      </TouchableOpacity>

      {footer}
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  info: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.success,
  },
});
