import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import {
  CATEGORIES,
  LISTING_TYPES,
  CONDITIONS,
  COLORS,
} from "../utils/constants";

export default function BrowseScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [listingType, setListingType] = useState("All");
  const [condition, setCondition] = useState("All");

  useEffect(() => {
    const sampleBooks = [
      {
        id: "1",
        title: "Introduction to Algorithms",
        author: "Cormen, Leiserson",
        category: "Computer Science",
        condition: "Good",
        price: 45,
        listingType: "Sale",
        status: "Available",
        contact: "john@example.com",
      },
      {
        id: "2",
        title: "The Art of Computer Programming",
        author: "Donald Knuth",
        category: "Computer Science",
        condition: "Like New",
        price: 0,
        listingType: "Exchange",
        status: "Available",
        contact: "sarah@example.com",
      },
    ];
    setBooks(sampleBooks);
  }, []);

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
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("BookDetail", { book: item })}
    >
      <View style={styles.bookInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>{item.condition}</Text>
          <Text style={[styles.badge, styles.typeBadge]}>
            {item.listingType}
          </Text>
        </View>
        {item.price > 0 && <Text style={styles.price}>₹{item.price}</Text>}
      </View>
    </TouchableOpacity>
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

      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No books found</Text>
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
  },
  bookCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bookInfo: {
    flex: 1,
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
    color: COLORS.primary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadge: {
    color: COLORS.secondary,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.success,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textLight,
    marginTop: 32,
  },
});
