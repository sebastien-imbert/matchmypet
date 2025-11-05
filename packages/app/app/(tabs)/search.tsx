import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Animal } from "../../../shared/generated/graphql-types";
import { AnimalCard } from "@/components/AnimalCard";

const GET_AVAILABLE_ANIMALS = gql`
  query GetAvailableAnimals {
    availableAnimals {
      id
      name
      species
      breed
      age
      description
      sex
      breedingStatus
      distance
      owner {
        id
        email
        location {
          latitude
          longitude
        }
      }
      createdAt
    }
  }
`;

const GET_LOOKING_ANIMALS = gql`
  query GetLookingAnimals {
    lookingAnimals {
      id
      name
      species
      breed
      age
      description
      sex
      breedingStatus
      distance
      owner {
        id
        email
        location {
          latitude
          longitude
        }
      }
      createdAt
    }
  }
`;

export default function AnimalsScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "LOOKING">("ALL");

  const { data, loading, error } = useQuery<{ availableAnimals: Animal[] }>(
    GET_AVAILABLE_ANIMALS
  );
  const {
    data: lookingData,
    loading: lookingLoading,
    error: lookingError,
  } = useQuery<{ lookingAnimals: Animal[] }>(GET_LOOKING_ANIMALS);

  const allAnimals = useMemo(() => {
    const available = data?.availableAnimals || [];
    const looking = lookingData?.lookingAnimals || [];
    return [...available, ...looking];
  }, [data, lookingData]);

  const filteredAnimals = useMemo(() => {
    let list = allAnimals;

    if (filter === "AVAILABLE") {
      list = list.filter((a) => a.breedingStatus === "AVAILABLE");
    } else if (filter === "LOOKING") {
      list = list.filter((a) => a.breedingStatus === "LOOKING");
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.species.toLowerCase().includes(lower) ||
          a.breed?.toLowerCase().includes(lower)
      );
    }

    return list;
  }, [allAnimals, filter, search]);

  if (loading || lookingLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );

  if (error || lookingError)
    return (
      <View style={styles.center}>
        <Text>Erreur : {error?.message || lookingError?.message}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rechercher un animal</Text>

      {/* Barre de recherche */}
      <TextInput
        placeholder="Rechercher par nom, espèce ou race..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Filtres */}
      <View style={styles.filterRow}>
        {["ALL", "AVAILABLE", "LOOKING"].map((type) => (
          <Pressable
            key={type}
            onPress={() => setFilter(type as any)}
            style={[
              styles.filterButton,
              filter === type && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}
            >
              {type === "ALL"
                ? "Tous"
                : type === "AVAILABLE"
                ? "Disponibles"
                : "En recherche"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Résultats */}
      {filteredAnimals.length === 0 ? (
        <Text style={styles.noResult}>Aucun animal trouvé.</Text>
      ) : (
        <FlatList
          data={filteredAnimals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalCard item={item} from="search" />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  searchInput: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  filterButtonActive: {
    backgroundColor: "#2196F3",
  },
  filterText: {
    color: "#555",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  noResult: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
});
