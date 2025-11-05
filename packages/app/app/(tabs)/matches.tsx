import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
export default function AnimalsTab() {
  return (
    <ScrollView style={styles.container}>
      <Text>Matches</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
});
