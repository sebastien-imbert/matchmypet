import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("hasOnboarded");
    router.replace("/onboarding");
  } catch (error) {
    console.error("Erreur lors du logout :", error);
  }
};
