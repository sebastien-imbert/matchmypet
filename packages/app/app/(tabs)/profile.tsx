import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import { User } from "../../../shared/generated/graphql-types";
import { ME } from "@/queries/me";
import { client } from "../apollo";

export default function ProfileScreen() {
  const router = useRouter();

  const { data, loading, error } = useQuery<{ me: User }>(ME);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const user = data;

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui, me déconnecter",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("hasOnboarded");
            await client.clearStore();
            router.replace("/onboarding");
          } catch (error) {
            console.error("Erreur lors du logout :", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil 👤</Text>
      <Text>Username: {user?.me.username}</Text>
      <Text>Email: {user?.me.email}</Text>
      {user?.me.location && (
        <Text>
          Location: Lat {user.me.location.latitude}, Lon {user.me.location.longitude}
        </Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: "#e53935",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
