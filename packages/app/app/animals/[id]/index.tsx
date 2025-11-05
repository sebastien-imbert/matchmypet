import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Animal,
  MutationDeleteAnimalArgs,
} from "../../../../shared/generated/graphql-types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GET_ANIMAL } from "@/queries/getAnimal";

const DELETE_ANIMAL = gql`
  mutation DeleteAnimal($input: DeleteAnimalInput!) {
    deleteAnimal(input: $input) {
      id
    }
  }
`;

export default function AnimalDetail() {
  const router = useRouter();
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();

  const { data, loading, error } = useQuery<{ getAnimal: Animal }>(GET_ANIMAL, {
    variables: { id },
  });

  const [deleteAnimal, { loading: isDeleting }] = useMutation<
    { deleteAnimal: Animal },
    MutationDeleteAnimalArgs
  >(DELETE_ANIMAL, {
    refetchQueries: ["MyAnimals"],
    awaitRefetchQueries: true,
  });

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );

  if (error || !data?.getAnimal)
    return (
      <View style={styles.center}>
        <Text>Erreur lors du chargement</Text>
      </View>
    );

  const animal = data.getAnimal;

  const handleDelete = (animalId: string) => {
    Alert.alert("Supprimer cet animal ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteAnimal({ variables: { input: { id: animalId } } });
          router.push("/(tabs)");
        },
      },
    ]);
  };

  const statusColor =
    animal.breedingStatus === "AVAILABLE" ? "#4CAF50" : "#FF9800";

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: "https://placecats.com/600/400" }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{animal.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {animal.breedingStatus === "AVAILABLE"
                ? "Disponible"
                : "Recherche"}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="paw" size={18} color="#666" />
          <Text style={styles.meta}>
            {animal.species} • {animal.age} ans
          </Text>
        </View>

        {animal.breed && (
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="dog" size={18} color="#666" />
            <Text style={styles.meta}>{animal.breed}</Text>
          </View>
        )}
        {animal.distance && (
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.meta}>
              {animal.distance?.toFixed(2).replace(".", ",")} km
            </Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name="gender-male-female"
            size={18}
            color="#666"
          />
          <Text style={styles.meta}>{animal.sex}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {animal.description || "Aucune description disponible."}
        </Text>

        <Text style={styles.createdAt}>
          Ajouté le {new Date(animal.createdAt).toLocaleDateString()}
        </Text>

        {from === "my-animals" && (
          <View style={styles.buttonsRow}>
            <Pressable
              style={[styles.button, styles.editButton]}
              onPress={() => router.push(`/animals/${animal.id}/edit`)}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
              <Text style={styles.buttonText}>Modifier</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDelete(animal.id)}
              disabled={isDeleting}
            >
              <MaterialCommunityIcons name="trash-can" size={18} color="#fff" />
              <Text style={styles.buttonText}>
                {isDeleting ? "Suppression..." : "Supprimer"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: "#eee",
  },
  content: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  name: { fontSize: 26, fontWeight: "700", color: "#222" },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: { color: "#fff", fontWeight: "600" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 3,
  },
  meta: { fontSize: 15, color: "#555" },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: { fontSize: 15, color: "#333", lineHeight: 22 },
  createdAt: {
    marginTop: 20,
    color: "#888",
    fontSize: 13,
    textAlign: "right",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButton: {
    backgroundColor: "#2196F3",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#E53935",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
