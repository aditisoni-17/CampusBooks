import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BookCard from "../components/BookCard";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import SearchBadge from "../components/SearchBadge";
import { useAppContext } from "../context/AppContext";
import { COLORS } from "../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WishlistScreen({ navigation }) {
  const { wishlist, removeWishlistItem, loading, reload } = useAppContext();
  const [removingId, setRemovingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      reload().catch(() => {});
    }, [reload])
  );

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      setRemovingId(bookId);
      await removeWishlistItem(bookId);
    } catch (error) {
      Alert.alert("Error", "Failed to remove from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  const renderBook = ({ item }) => (
    <BookCard
      compact
      title={item.title}
      author={item.author}
      price={item.price}
      imageUri={item.imageUri}
      onPress={() => navigation.navigate("BookDetail", { book: item })}
      badges={[{ label: item.listingType, style: styles.badge }]}
      rightAction={
        <Button
          title="Remove"
          variant="secondary"
          onPress={() => handleRemoveFromWishlist(item.id)}
          disabled={removingId === item.id}
          loading={removingId === item.id}
          loadingText="Removing..."
          style={styles.removeButton}
        />
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.heading}>My Wishlist</Text>
        <View style={styles.debugRow}>
          <SearchBadge
            label="Saved"
            value={loading ? "Loading..." : wishlist.length}
            tone="success"
          />
        </View>

        <FlatList
          data={wishlist}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="Wishlist"
            title="Your wishlist is empty"
            description="Save interesting books here so you can compare them later."
            action={
              <Button
                title="Browse books"
                onPress={() => navigation.navigate("Browse")}
                style={styles.browseButton}
              />
            }
          />
        }
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  debugRow: {
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  badge: {
    fontSize: 12,
    color: COLORS.secondary,
    backgroundColor: COLORS.background,
  },
  removeButton: {
    paddingHorizontal: 12,
  },
  browseButton: {
    paddingHorizontal: 18,
  },
});
