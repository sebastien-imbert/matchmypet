import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { useColorScheme } from "@/components/useColorScheme";
import { ActivityIndicator, View } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const [checking, setChecking] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await SecureStore.getItemAsync("hasOnboarded");
        const token = await SecureStore.getItemAsync("userToken");
        console.log("Onboarding status:", value);
        console.log("User token:", token);
        setHasOnboarded(value === "true");
      } catch (e) {
        console.warn("Erreur lecture SecureStore:", e);
      } finally {
        setChecking(false);
      }
    };
    checkOnboarding();
  }, []);

  // useEffect(() => {
  //   const deleteAll = async () => {
  //     await SecureStore.deleteItemAsync("userToken");
  //     await SecureStore.deleteItemAsync("hasOnboarded");
  //   };
  //   deleteAll();
  // }, []);

  if (!loaded || checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootLayoutNav hasOnboarded={hasOnboarded} />;
}

function RootLayoutNav({ hasOnboarded }: { hasOnboarded: boolean | null }) {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName={hasOnboarded ? "(tabs)" : "onboarding"}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{ title: "Menu", headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ title: "Informations", presentation: "modal" }}
          />
        </Stack>
      </ThemeProvider>
      <Toast />
    </ApolloProvider>
  );
}
