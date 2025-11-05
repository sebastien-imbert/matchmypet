import { Pressable, View, Text, StyleSheet, Image } from "react-native";
import { Animal } from "../../shared/generated/graphql-types";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const AnimalCard = ({ item }: { item: Animal }) => {
  const router = useRouter();

  const statusColor =
    item.breedingStatus === "AVAILABLE" ? "#4CAF50" : "#FF9800";

  return (
    <Pressable
      onPress={() => router.push(`/animals/${item.id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Image
        source={{
          uri:
            "https://placecats.com/200/200" /* futur champ image */,
        }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {item.breedingStatus === "AVAILABLE"
                ? "Disponible"
                : "Recherche"}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="paw" size={16} color="#666" />
          <Text style={styles.meta}>
            {item.species} • {item.age} ans
          </Text>
        </View>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="gender-male-female" size={16} color="#666" />
          <Text style={styles.meta}>{item.sex}</Text>
        </View>

        {item.description ? (
          <Text numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  meta: {
    color: "#555",
    fontSize: 13,
  },
  description: {
    marginTop: 6,
    color: "#666",
    fontSize: 13,
  },
});
