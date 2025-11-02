import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Animal } from "../../../shared/generated/graphql-types";

const MY_ANIMALS_QUERY = gql`
  query MyAnimals {
    myAnimals {
      id
      name
      species
      age
      sex
      breedingStatus
    }
  }
`;

export default function HomeTab() {
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
    <Pressable onPress={() => router.push(`/animals/${item.id}`)}>
      
      <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>
        {item.species} - {item.age} ans - {item.sex}
      </Text>
      <Text>Status de reproduction: {item.breedingStatus}</Text>
    </View>
    </Pressable>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Mes animaux</Text>
        <FlatList
          data={animals}
          keyExtractor={(item) => item.id}
          renderItem={renderAnimal}
          contentContainerStyle={{ padding: 20 }}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/animals/add")}
        >
          <Text style={styles.addButtonText}>Ajouter un animal</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "600",
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
  name: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
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
