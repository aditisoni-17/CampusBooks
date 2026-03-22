import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../components/Button";
import InputField from "../components/InputField";
import SearchBadge from "../components/SearchBadge";
import { useAppContext } from "../context/AppContext";
import { CATEGORIES, COLORS, LISTING_TYPES } from "../utils/constants";

const CONDITIONS = ["Like New", "Good", "Fair", "Poor"];
const DEFAULT_CATEGORY = "Computer Science";
const DEFAULT_CONDITION = "Good";
const DEFAULT_LISTING_TYPE = "Sale";

export default function CreateListingScreen({ navigation }) {
  const { createListing, reload } = useAppContext();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [condition, setCondition] = useState(DEFAULT_CONDITION);
  const [listingType, setListingType] = useState(DEFAULT_LISTING_TYPE);
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});

  const errors = {
    title: title.trim() ? "" : "Title is required",
    author: author.trim() ? "" : "Author is required",
    contact: contact.trim() ? "" : "Contact is required",
  };
  const isFormValid = !errors.title && !errors.author && !errors.contact;

  useFocusEffect(
    useCallback(() => {
      reload().catch(() => {});
    }, [reload])
  );

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory(DEFAULT_CATEGORY);
    setCondition(DEFAULT_CONDITION);
    setListingType(DEFAULT_LISTING_TYPE);
    setPrice("");
    setContact("");
    setLocation("");
    setImageUri(null);
    setTouched({});
  };

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const getFieldError = (field) => (touched[field] ? errors[field] : "");

  const handleSubmit = async () => {
    if (!isFormValid) {
      setTouched({
        title: true,
        author: true,
        contact: true,
      });
      return;
    }

    try {
      setSaving(true);
      await createListing({
        title: title.trim(),
        author: author.trim(),
        category,
        condition,
        listingType,
        price: listingType === "Sale" ? parseFloat(price) || 0 : 0,
        contact: contact.trim(),
        location: location.trim() || "Campus meetup spot",
        imageUri,
      });

      resetForm();
      Alert.alert("Success", "Listing created!", [
        { text: "OK", onPress: () => navigation.navigate("MyListings") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create listing");
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow gallery access to pick an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      setImageUri(result.assets?.[0]?.uri || null);
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const renderPills = (options, selectedValue, onSelect) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.pills}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.pill, selectedValue === option && styles.pillActive]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.pillText,
              selectedValue === option && styles.pillTextActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Create New Listing</Text>

        <View style={styles.debugRow}>
          <SearchBadge label="Storage" value="AsyncStorage" tone="success" />
          <SearchBadge label="Mode" value="Local only" />
          <SearchBadge
            label="Ready"
            value={isFormValid ? "Yes" : "Missing fields"}
            tone={isFormValid ? "success" : "warning"}
          />
        </View>

        <InputField
          label="Title *"
          value={title}
          onChangeText={setTitle}
          onBlur={() => markTouched("title")}
          placeholder="Enter book title"
          invalid={Boolean(getFieldError("title"))}
          error={getFieldError("title")}
        />

        <InputField
          label="Author *"
          value={author}
          onChangeText={setAuthor}
          onBlur={() => markTouched("author")}
          placeholder="Enter author name"
          invalid={Boolean(getFieldError("author"))}
          error={getFieldError("author")}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          {renderPills(CATEGORIES.filter((item) => item !== "All"), category, setCategory)}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Condition</Text>
          {renderPills(CONDITIONS, condition, setCondition)}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Listing Type</Text>
          {renderPills(
            LISTING_TYPES.filter((item) => item !== "All"),
            listingType,
            setListingType
          )}
        </View>

        {listingType === "Sale" && (
          <InputField
            label="Price (₹)"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
          />
        )}

        <InputField
          label="Contact Info *"
          value={contact}
          onChangeText={setContact}
          onBlur={() => markTouched("contact")}
          placeholder="Email or phone number"
          invalid={Boolean(getFieldError("contact"))}
          error={getFieldError("contact")}
        />

        <InputField
          label="Meetup Location"
          value={location}
          onChangeText={setLocation}
          placeholder="Library gate, dorm lobby, etc."
        />

        <View style={styles.field}>
          <Text style={styles.label}>Book Image</Text>
          <Button
            title={imageUri ? "Change Image" : "Pick Image"}
            onPress={handlePickImage}
            style={styles.imageButton}
          />
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.imageHint}>No image selected</Text>
          )}
        </View>

        <Button
          title="Create Listing"
          onPress={handleSubmit}
          disabled={!isFormValid || saving}
          loading={saving}
          loadingText="Saving locally..."
          style={styles.submitButton}
        />

        {!isFormValid && (
          <Text style={styles.helperText}>
            Required fields must be completed before creating a listing.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
  },
  debugRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  pills: {
    flexDirection: "row",
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 14,
    color: COLORS.text,
  },
  pillTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  imageButton: {
    marginBottom: 12,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: COLORS.card,
  },
  imageHint: {
    color: COLORS.textLight,
    fontSize: 13,
  },
  helperText: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 24,
  },
});
