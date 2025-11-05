import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AnimalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Animaux 🐾</Text>
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 50,
  },
});
