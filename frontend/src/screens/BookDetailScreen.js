import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import SearchBadge from "../components/SearchBadge";
import { getSimilarBooks } from "../services";
import { COLORS } from "../utils/constants";

export default function BookDetailScreen({ route, navigation }) {
  const { book: routeBook } = route.params;
  const { books, wishlist, addWishlistItem, removeWishlistItem, reload } =
    useAppContext();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const book = books.find((item) => item.id === routeBook.id) || routeBook;

  useFocusEffect(
    useCallback(() => {
      reload().catch(() => {});
    }, [reload])
  );

  useEffect(() => {
    setInWishlist(wishlist.some((item) => item.id === book.id));
  }, [wishlist, book.id]);

  useEffect(() => {
    let isMounted = true;

    const loadSimilarBooks = async () => {
      setLoadingSimilar(true);
      try {
        const relatedBooks = await getSimilarBooks(book);
        if (isMounted) {
          setSimilarBooks(relatedBooks);
        }
      } catch (error) {
        console.error("[BookDetailScreen] failed to load similar books", error);
      } finally {
        if (isMounted) {
          setLoadingSimilar(false);
        }
      }
    };

    loadSimilarBooks();

    return () => {
      isMounted = false;
    };
  }, [book.id, books]);

  const handleContact = () => {
    Alert.alert(
      "Contact Seller",
      `Email/Phone: ${book.contact}\nLocation: ${book.location}\n\nYou can reach out to discuss this book!`,
      [{ text: "OK" }]
    );
  };

  const toggleWishlist = async () => {
    if (wishlistUpdating) {
      return;
    }

    try {
      setWishlistUpdating(true);
      if (inWishlist) {
        await removeWishlistItem(book.id);
      } else {
        await addWishlistItem(book);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update wishlist");
    } finally {
      setWishlistUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {book.imageUri ? (
          <Image source={{ uri: book.imageUri }} style={styles.coverImage} />
        ) : null}
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.debugRow}>
          <SearchBadge
            label="Status"
            value={book.status}
            tone={book.status === "Available" ? "success" : "warning"}
          />
          <SearchBadge label="Wishlist" value={inWishlist ? "Saved" : "Not saved"} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{book.category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Condition:</Text>
          <Text style={styles.value}>{book.condition}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={[styles.value, styles.typeBadge]}>
            {book.listingType}
          </Text>
        </View>

        {book.price > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.price}>₹{book.price}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              book.status === "Available" ? styles.available : styles.sold,
            ]}
          >
            {book.status}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{book.contact}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{book.location}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContact}>
          <Text style={styles.buttonText}>Contact Seller</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            inWishlist && styles.inWishlist,
            wishlistUpdating && styles.secondaryButtonDisabled,
          ]}
          onPress={toggleWishlist}
          disabled={wishlistUpdating}
        >
          <Text style={styles.secondaryButtonText}>
            {wishlistUpdating
              ? "Updating Wishlist..."
              : inWishlist
                ? "💚 In Wishlist"
                : "🤍 Add to Wishlist"}
          </Text>
        </TouchableOpacity>
      </View>

      {loadingSimilar && (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading similar books...</Text>
        </View>
      )}

      {!loadingSimilar && similarBooks.length > 0 && (
        <View style={styles.similarSection}>
          <Text style={styles.sectionTitle}>Similar Books</Text>
          {similarBooks.map((similar) => (
            <TouchableOpacity
              key={similar.id}
              style={styles.similarCard}
              onPress={() => navigation.push("BookDetail", { book: similar })}
            >
              <Text style={styles.similarTitle}>{similar.title}</Text>
              <Text style={styles.similarAuthor}>{similar.author}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  coverImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  details: {
    padding: 20,
    backgroundColor: COLORS.card,
    marginTop: 12,
  },
  debugRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  typeBadge: {
    color: COLORS.secondary,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.success,
  },
  available: {
    color: COLORS.success,
  },
  sold: {
    color: COLORS.danger,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inWishlist: {
    borderColor: COLORS.success,
    backgroundColor: "#E8F5E9",
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonDisabled: {
    opacity: 0.65,
  },
  similarSection: {
    padding: 20,
  },
  loadingState: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  similarCard: {
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  similarAuthor: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
});
