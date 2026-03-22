import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import FilterBar from "../components/FilterBar";
import SearchBadge from "../components/SearchBadge";
import SearchBar from "../components/SearchBar";
import { useAppContext } from "../context/AppContext";
import {
  CATEGORIES,
  COLORS,
  CONDITIONS,
  LISTING_TYPES,
} from "../utils/constants";

export default function BrowseScreen({ navigation }) {
  const { books, loading, reload } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [listingType, setListingType] = useState("All");
  const [condition, setCondition] = useState("All");
  const activeFilterCount = [category, listingType, condition].filter(
    (value) => value !== "All"
  ).length;

  useFocusEffect(
    useCallback(() => {
      reload().catch(() => {});
    }, [reload])
  );

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = category === "All" || book.category === category;
    const matchesType =
      listingType === "All" || book.listingType === listingType;
    const matchesCondition =
      condition === "All" || book.condition === condition;

    return matchesSearch && matchesCategory && matchesType && matchesCondition;
  });

  const renderBook = ({ item }) => (
    <BookCard
      title={item.title}
      author={item.author}
      price={item.price}
      imageUri={item.imageUri}
      onPress={() => navigation.navigate("BookDetail", { book: item })}
      badges={[
        { label: item.condition, style: styles.badge },
        { label: item.listingType, style: [styles.badge, styles.typeBadge] },
        {
          label: item.status,
          style: [
            styles.badge,
            item.status === "Available" ? styles.availableBadge : styles.soldBadge,
          ],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by title or author"
      />

      <FilterBar
        label="Category"
        options={CATEGORIES}
        selectedValue={category}
        onSelect={setCategory}
      />

      <FilterBar
        label="Type"
        options={LISTING_TYPES}
        selectedValue={listingType}
        onSelect={setListingType}
      />

      <FilterBar
        label="Condition"
        options={CONDITIONS}
        selectedValue={condition}
        onSelect={setCondition}
      />

      <View style={styles.debugRow}>
        <SearchBadge
          label="Results"
          value={loading ? "Loading..." : filteredBooks.length}
          tone="success"
        />
        <SearchBadge label="Filters" value={activeFilterCount} />
        <SearchBadge
          label="Query"
          value={searchQuery.trim() ? `"${searchQuery.trim()}"` : "None"}
        />
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No books found"
            description="Try clearing a filter or searching with a different keyword."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  debugRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    fontSize: 12,
    backgroundColor: COLORS.background,
    color: COLORS.primary,
  },
  typeBadge: {
    color: COLORS.secondary,
  },
  availableBadge: {
    color: COLORS.success,
  },
  soldBadge: {
    color: COLORS.danger,
  },
});
