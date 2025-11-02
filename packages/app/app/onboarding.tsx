import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { KeyboardAvoidingView, Platform } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AuthPayload, MutationSignupArgs } from "../../shared/generated/graphql-types";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export function PasswordInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={{ width: "100%", position: "relative" }}>
      <TextInput
        style={{
          backgroundColor: "#f2f2f2",
          padding: 14,
          borderRadius: 12,
          color: "#000",
          fontSize: 16,
          paddingRight: 45, // espace pour l'icône
        }}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: [{ translateY: -12 }],
        }}
        onPress={() => setSecure(!secure)}
      >
        <FontAwesome
          name={secure ? "eye-slash" : "eye"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>
    </View>
  );
}

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { loading, error }] = useMutation<
    { signup: AuthPayload },
    MutationSignupArgs
  >(SIGNUP_MUTATION);

  const router = useRouter();

  const handleSignup = async () => {
    try {
      const { data } = await signup({
        variables: { email, password },
      });

      if (data?.signup?.token) {

        await SecureStore.setItemAsync("userToken", data.signup.token);
        await SecureStore.setItemAsync("hasOnboarded", "true");
        finishOnboarding();
        router.replace("/(tabs)");
      }
    } catch (e) {
      console.error("Signup failed", e);
    }
  };

  const slides = [
    {
      title: "Bienvenue sur MatchMyPet! 🐾",
      description:
        "Découvrez une plateforme sécurisée pour connecter propriétaires d’animaux et faciliter les saillies de manière simple et fiable.",
      // image: require('../assets/onboarding1.png'),
    },
    {
      title: "Sécurité et fiabilité 🔐",
      description:
        "Tous les profils sont vérifiés et les informations médicales sont centralisées pour garantir des rencontres responsables et sereines.",
      // image: require('../assets/onboarding2.png'),
    },
    {
      title: "Commencez dès maintenant 🚀",
      description:
        "Créez votre compte pour accéder aux profils, proposer ou rechercher des saillies et suivre toutes vos interactions en toute sécurité.",
      // image: require('../assets/onboarding3.png'),
    },
  ];

  const finishOnboarding = async () => {
    await SecureStore.setItemAsync("hasOnboarded", "true");
    router.replace("/(tabs)");
  };

  return (
    <Swiper
      loop={false}
      showsButtons={false}
      dotColor="#ccc"
      activeDotColor="#000"
    >
      {slides.map((slide, i) => (
        <View key={i} style={styles.slide}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "center", width: "100%" }}
          >
            {/* <Image source={slide.image} style={styles.image} /> */}
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            {i === slides.length - 1 && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <PasswordInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mot de passe"
                />
                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.6 }]}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Création..." : "S'inscrire"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  style={{ marginTop: 20 }}
                >
                  <Text style={styles.linkText}>
                    Déjà un compte ? Se connecter
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 14,
    marginBottom: 15,
    borderRadius: 12,
    color: "#000",
    fontSize: 16,
  },

  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  linkText: {
    color: "#555",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
