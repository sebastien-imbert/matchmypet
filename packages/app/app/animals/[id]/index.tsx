import { View, Text, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Animal } from "../../../../shared/generated/graphql-types";

const GET_ANIMAL = gql`
  query GetAnimal($id: ID!) {
    getAnimal(id: $id) {
      id
      name
      species
      sex
      age
      breed
      description
      breedingStatus
      createdAt
    }
  }
`;

const DELETE_ANIMAL = gql`
  mutation DeleteAnimal($id: ID!) {
    deleteAnimal(id: $id) {
      id
    }
  }
`;

export default function AnimalDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, loading, error } = useQuery<{ getAnimal: Animal }>(GET_ANIMAL, {
    variables: { id },
  });

  const [deleteAnimal, { loading: isDeleting, error: deleteError }] = useMutation<
    { deleteAnimal: Animal },
    { id: string }
  >(DELETE_ANIMAL, {
    refetchQueries: ["MyAnimals"],
    awaitRefetchQueries: true,
  });

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error || !data?.getAnimal) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Erreur lors du chargement de l'animal</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const animal = data.getAnimal;

  const handleDelete = (animalId: string) => {
    deleteAnimal({ variables: { id: animalId } });
    router.push("/(tabs)");
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{animal.name}</Text>
      <Text>Espèce: {animal.species}</Text>
      <Text>Sexe: {animal.sex}</Text>
      <Text>Âge: {animal.age}</Text>
      <Text>Race: {animal.breed}</Text>
      <Text>Description: {animal.description}</Text>
      <Text>Statut de reproduction: {animal.breedingStatus}</Text>
      <Text>Date de création: {animal.createdAt}</Text>
      <Button title="Supprimer" color={"red"} onPress={() => Alert.alert("Êtes-vous sûr de vouloir supprimer cet animal ?", "", [{ text: "Annuler" }, { text: "Supprimer", onPress: () => handleDelete(animal.id) }])} />
      <Button title="Modifier" onPress={() => router.push(`/animals/${animal.id}/edit`)} />
    </View>
  );
}
