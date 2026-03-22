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


export default function MyListingsScreen({ navigation }) {
  const { books, changeStatus, deleteListing, loading, reload } = useAppContext();
  const [busyListingId, setBusyListingId] = useState(null);
  const [busyAction, setBusyAction] = useState(null);

  const myBooks = books;

  useFocusEffect(
    useCallback(() => {
      reload().catch(() => {});
    }, [reload])
  );

  const handleToggleStatus = async (bookId) => {
    try {
      setBusyListingId(bookId);
      setBusyAction("status");
      await changeStatus(bookId);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setBusyListingId(null);
      setBusyAction(null);
    }
  };

  const handleDeleteListing = (bookId) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setBusyListingId(bookId);
              setBusyAction("delete");
              await deleteListing(bookId);
            } catch (error) {
              Alert.alert("Error", "Failed to delete listing");
            } finally {
              setBusyListingId(null);
              setBusyAction(null);
            }
          },
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <BookCard
      title={item.title}
      author={item.author}
      price={item.price}
      imageUri={item.imageUri}
      onPress={() => navigation.navigate("BookDetail", { book: item })}
      badges={[
        { label: item.listingType, style: styles.badge },
        {
          label: item.status,
          style: [styles.badge, item.status === "Available" ? styles.available : styles.sold],
        },
      ]}
      footer={
        <View style={styles.actions}>
          <Button
            title={item.status === "Available" ? "Mark Sold" : "Mark Available"}
            onPress={() => handleToggleStatus(item.id)}
            disabled={busyListingId === item.id}
            loading={busyListingId === item.id && busyAction === "status"}
            loadingText="Updating..."
            style={styles.actionButton}
          />
          <Button
            title="Delete"
            variant="secondary"
            onPress={() => handleDeleteListing(item.id)}
            disabled={busyListingId === item.id}
            loading={busyListingId === item.id && busyAction === "delete"}
            loadingText="Removing..."
            style={styles.deleteButton}
          />
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>My Listings</Text>
            <View style={styles.debugRow}>
              <SearchBadge
                label="Listings"
                value={loading ? "Loading..." : myBooks.length}
                tone="success"
              />
            </View>
          </View>
          <Button
            title="Add New"
            onPress={() => navigation.navigate("Create")}
            style={styles.addButton}
          />
        </View>

        <FlatList
          data={myBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="Books"
            title="No listings yet"
            description="Add your first textbook listing to start sharing it across campus."
            action={
              <Button
                title="Create your first listing"
                onPress={() => navigation.navigate("Create")}
                style={styles.emptyButton}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  debugRow: {
    marginTop: 8,
  },
  addButton: {
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  badge: {
    fontSize: 12,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  available: {
    color: COLORS.success,
  },
  sold: {
    color: COLORS.danger,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  emptyButton: {
    paddingHorizontal: 20,
  },
});
