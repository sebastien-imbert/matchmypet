import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import { Animal } from "../../../shared/generated/graphql-types";
import { AnimalCard } from "@/components/AnimalCard";
import { MY_ANIMALS_QUERY } from "@/queries/myAnimals";

export default function AnimalsTab() {
  const router = useRouter();
  const { data, loading, error } = useQuery<{ myAnimals: Animal[] }>(
    MY_ANIMALS_QUERY
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erreur lors du chargement de vos animaux</Text>
      </View>
    );
  }

  const animals = data?.myAnimals || [];

  if (animals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Vous n’avez pas encore ajouté d’animal 🐾
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/animals/add")}
        >
          <Text style={styles.buttonText}>Ajouter mon premier animal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderAnimal = ({ item }: { item: Animal }) => (
    <AnimalCard item={item} from="my-animals" />
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mes animaux 🐾</Text>
      <FlatList
        data={animals}
        keyExtractor={(item) => item.id}
        renderItem={renderAnimal}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/animals/add")}
      >
        <Text style={styles.addButtonText}>Ajouter un animal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  bottom: {
    marginTop: 30,
    alignItems: "center",
  },
  footer: {
    fontSize: 14,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    margin: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
