import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  QueryGetAnimalArgs,
  EditAnimalInput,
  MutationEditAnimalArgs,
  Animal,
} from "../../../../shared/generated/graphql-types";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";

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

const EDIT_ANIMAL = gql`
  mutation EditAnimal($input: EditAnimalInput!) {
    editAnimal(input: $input) {
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

export default function EditAnimalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, loading, error } = useQuery<{ getAnimal: Animal }>(GET_ANIMAL, {
    variables: { id },
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

  const [name, setName] = useState(animal.name);
  const [species, setSpecies] = useState<"CHIEN" | "CHAT">(animal.species);
  const [sex, setSex] = useState<"MALE" | "FEMALE">(animal.sex);
  const [age, setAge] = useState(animal.age.toString());
  const [breed, setBreed] = useState(animal.breed);
  const [description, setDescription] = useState(animal.description);
  const [breedingStatus, setBreedingStatus] = useState<
    "AVAILABLE" | "LOOKING" | "NONE"
  >(animal.breedingStatus);

  const [editAnimal, { loading: isEditing, error: editError }] = useMutation<
    { editAnimal: EditAnimalInput },
    MutationEditAnimalArgs
  >(EDIT_ANIMAL, {
    refetchQueries: ["MyAnimals"], // 👈 nom exact de ta query côté client
    awaitRefetchQueries: true,
  });

  const handleSubmit = async () => {
    if (!name || !age) {
      Alert.alert("Erreur", "Merci de remplir au moins le nom et l’âge");
      return;
    }
    try {
      const { data } = await editAnimal({
        variables: {
          input: {
            id: animal.id,
            name,
            sex,
            age: parseInt(age),
            species,
            breed,
            description,
            breedingStatus,
          },
        },
      });

      if (data?.editAnimal) {
        Alert.alert("Succès", `${data.editAnimal.name} a été modifié !`);
        router.push("/(tabs)");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Modifier un animal
      </Text>

      <Text>Nom</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nom de l’animal"
        style={styles.input}
      />

      <Text>Espèce (CHIEN / CHAT)</Text>
      <TextInput
        value={species}
        onChangeText={(text) =>
          setSpecies(text.toUpperCase() as "CHIEN" | "CHAT")
        }
        placeholder="CHIEN ou CHAT"
        style={styles.input}
      />

      <Text style={{ fontSize: 16, fontWeight: "600" }}>Sexe</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginVertical: 8,
        }}
      >
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
        >
          <Picker.Item label="Mâle" value="MALE" />
          <Picker.Item label="Femelle" value="FEMALE" />
        </Picker>
      </View>

      <Text>Âge</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Âge en années"
        style={styles.input}
      />

      <Text>Race (optionnel)</Text>
      <TextInput
        value={breed || ""}
        onChangeText={setBreed}
        placeholder="Ex: Labrador"
        style={styles.input}
      />

      <Text>Description (optionnel)</Text>
      <TextInput
        value={description || ""}
        onChangeText={setDescription}
        placeholder="Quelques mots sur l’animal"
        multiline
        style={[styles.input, { height: 80 }]}
      />

      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Statut de reproduction
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginVertical: 8,
        }}
      >
        <Picker
          selectedValue={breedingStatus}
          onValueChange={(itemValue) => setBreedingStatus(itemValue)}
        >
          <Picker.Item label="Aucun" value="NONE" />
          <Picker.Item label="Disponible pour saillie" value="AVAILABLE" />
          <Picker.Item label="Recherche de partenaire" value="LOOKING" />
        </Picker>
      </View>

      <Button
        title={loading ? "Loading..." : "Modifier l’animal"}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
};
