import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../utils/constants";

export default function InputField({
  label,
  style,
  error,
  invalid = false,
  ...props
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, invalid && styles.inputInvalid, style]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.text,
  },
  inputInvalid: {
    borderColor: COLORS.danger,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.danger,
  },
});
