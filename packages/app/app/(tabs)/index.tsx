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
import { HOME_DATA_QUERY } from "@/queries/homeData";
import { AnimalCard } from "@/components/AnimalCard";
import { Animal, User } from "../../../shared/generated/graphql-types";

export default function HomeTab() {
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<{
    homeData: {
      me: User;
      myAnimals: Animal[];
      availableAnimals: Animal[];
      lookingAnimals: Animal[];
    };
  }>(HOME_DATA_QUERY);

  const user = data?.homeData.me;
  const myAnimals = data?.homeData.myAnimals || [];
  const availableAnimals = data?.homeData.availableAnimals || [];
  const lookingAnimals = data?.homeData.lookingAnimals || [];

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>⏳ Chargement de vos données...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>❌ Erreur : impossible de charger les informations.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Header bienvenue */}
      {user && (
        <View style={styles.header}>
          
          <Text style={styles.welcome}>👋 Bonjour {user.username}</Text>
          <Text style={styles.subtext}>Heureux de vous revoir !</Text>
        </View>
      )}

      {/* Résumé stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{availableAnimals.length}</Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lookingAnimals.length}</Text>
          <Text style={styles.statLabel}>En recherche</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{myAnimals.length}</Text>
          <Text style={styles.statLabel}>Mes animaux</Text>
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>⚡ Actions rapides</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/animals/add")}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>Rechercher</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/matches")}
          >
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionText}>Matchs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Mes animaux */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🐾 Mes animaux</Text>
        {myAnimals.length === 0 ? (
          <Text style={styles.emptyText}>
            Vous n’avez pas encore ajouté d’animal.
          </Text>
        ) : (
          <FlatList
            data={myAnimals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AnimalCard item={item} from="home" />}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Section Dispos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🐶 Derniers animaux disponibles</Text>
        {availableAnimals.length === 0 ? (
          <Text style={styles.emptyText}>Aucun animal disponible.</Text>
        ) : (
          <FlatList
            data={availableAnimals.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AnimalCard item={item} from="home" />}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Section En recherche */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❤️ En recherche de partenaire</Text>
        {lookingAnimals.length === 0 ? (
          <Text style={styles.emptyText}>
            Aucun animal ne recherche actuellement.
          </Text>
        ) : (
          <FlatList
            data={lookingAnimals.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AnimalCard item={item} from="home" />}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  retryText: { marginTop: 8, color: "#007AFF", fontWeight: "500" },
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingHorizontal: 20 },
  header: { marginTop: 30, marginBottom: 15 },
  welcome: { fontSize: 24, fontWeight: "700" },
  subtext: { fontSize: 14, color: "#666" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 22, fontWeight: "700", color: "#000" },
  statLabel: { color: "#666", fontSize: 13 },
  actionsContainer: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  actionsRow: { flexDirection: "row", justifyContent: "space-around" },
  actionButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: { fontSize: 22, marginBottom: 4 },
  actionText: { fontWeight: "600", textAlign: "center", fontSize: 12 },
  section: { marginTop: 30 },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
    marginTop: 8,
  },
});
