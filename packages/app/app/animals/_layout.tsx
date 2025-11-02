import { Stack } from "expo-router";

export default function AnimalsLayout() {
  return (
    <Stack  screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="add" options={{ title: "Ajouter un animal" }} />
      <Stack.Screen
        name="[id]/index"
        options={{ title: "Détails de l’animal" }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{ title: "Modifier l’animal" }}
      />
    </Stack>
  );
}
