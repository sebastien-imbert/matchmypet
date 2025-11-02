import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@apollo/client/react";
import { gql } from "graphql-tag";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import {
  AuthPayload,
  MutationLoginArgs,
} from "../../shared/generated/graphql-types";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        email
      }
    }
  }
`;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation<
    { login: AuthPayload },
    MutationLoginArgs
  >(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({
        variables: { input: { email, password } },
      });

      if (data?.login?.token) {
        await SecureStore.setItemAsync("userToken", data.login.token);
        await SecureStore.setItemAsync("hasOnboarded", "true");
        router.replace("/(tabs)");
      }
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>Erreur : {error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 30 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "red", marginTop: 10 },
});
