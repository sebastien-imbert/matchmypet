import { View, Text, ScrollView } from "react-native";

export default function ModalScreen() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }}>
        🐾 Bienvenue sur MatchMyPet{" "}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 15, lineHeight: 22 }}>
        MatchMyPet est une application qui te permet d’enregistrer tes animaux,
        de les présenter à la communauté et de trouver des partenaires pour la
        reproduction. L’objectif : faciliter les échanges entre passionnés tout
        en assurant le bien-être des animaux.
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
        💡 Fonctionnement
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 15, lineHeight: 22 }}>
        • Crée un compte en quelques secondes.{"\n"}• Ajoute ton animal :
        espèce, sexe, âge, race, description et statut de reproduction.{"\n"}•
        Découvre les autres animaux disponibles ou en recherche.{"\n"}• Mets à
        jour les informations de ton compagnon à tout moment.
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
        🔒 Sécurité et respect
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 15, lineHeight: 22 }}>
        MatchMyPet ne publie aucune donnée sans ton accord. Toutes les
        informations partagées sont visibles uniquement par les utilisateurs
        connectés. Les échanges doivent rester bienveillants et respectueux du
        bien-être animal.
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
        🚀 À venir
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 15, lineHeight: 22 }}>
        Nous travaillons sur de nouvelles fonctionnalités : filtres de recherche
        avancés, localisation, messagerie entre propriétaires, et galerie photo.
        {"\n"}
        Reste connecté pour découvrir les prochaines mises à jour !
      </Text>

      <Text style={{ fontSize: 16, color: "#888", marginTop: 20 }}>
        Version bêta – MatchMyPet © 2025
      </Text>
    </ScrollView>
  );
}
