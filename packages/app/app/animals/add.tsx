import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import {
  CreateAnimalInput,
  MutationCreateAnimalArgs,
} from "../../../shared/generated/graphql-types";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// ✅ Mutation GraphQL
const CREATE_ANIMAL = gql`
  mutation CreateAnimal($input: CreateAnimalInput!) {
    createAnimal(input: $input) {
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

export default function CreateAnimalScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"CHIEN" | "CHAT">("CHIEN");
  const [sex, setSex] = useState<"MALE" | "FEMALE">("MALE");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [breedingStatus, setBreedingStatus] = useState<
    "AVAILABLE" | "LOOKING" | "NONE"
  >("NONE");

  const [createAnimal, { loading }] = useMutation<
    { createAnimal: CreateAnimalInput },
    MutationCreateAnimalArgs
  >(CREATE_ANIMAL, {
    refetchQueries: ["MyAnimals", "GetAvailableAnimals", "GetLookingAnimals"], // 👈 nom exact de ta query côté client
    awaitRefetchQueries: true,
  });

    const showToast = () => {
    Toast.show({
      type: 'success',
      text1: `${name} a été ajouté avec succès !`,
      text2: 'Vous pouvez maintenant le retrouver dans votre profil.'
    });
  }

  const handleSubmit = async () => {
    if (!name || !age) {
      Alert.alert("Erreur", "Merci de remplir au moins le nom et l’âge");
      return;
    }
    try {
      const { data } = await createAnimal({
        variables: {
          input: {
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

      if (data?.createAnimal) {
        showToast();
        setName("");
        setAge("");
        setBreed("");
        setDescription("");
        setBreedingStatus("NONE");
        router.push("/(tabs)");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          Ajouter un animal
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
          value={breed}
          onChangeText={setBreed}
          placeholder="Ex: Labrador"
          style={styles.input}
        />

        <Text>Description (optionnel)</Text>
        <TextInput
          value={description}
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
          title={loading ? "Ajout..." : "Créer l’animal"}
          onPress={handleSubmit}
        />
      </SafeAreaView>
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
