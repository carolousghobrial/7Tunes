import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../stores/redux/store";
import { StatusBar, ImageBackground, StyleSheet, Platform } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import useFonts from "../helpers/useFonts";

const configurePurchases = async () => {
  try {
    const apiKey =
      Platform.OS === "ios"
        ? "appl_ZaFObrSSGpHIPXcBxgCOYckdVpP"
        : "goog_ICeqiHcYzQRzROFBJsEVAAirhPX";
    await Purchases.configure({ apiKey });
  } catch (e) {
    console.warn("Error configuring Purchases:", e);
  }
};

const initializeApp = async (setAppIsReady) => {
  try {
    await useFonts();
    await configurePurchases();
  } catch (e) {
    console.warn("Error during initialization:", e);
  } finally {
    setAppIsReady(true);
  }
};

export default function RootLayout({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    initializeApp(setAppIsReady);
  }, []);

  if (!appIsReady) return null; // Add a loading screen if needed

  return (
    <GestureHandlerRootView style={styles.flexContainer}>
      <StatusBar hidden={Platform.OS === "ios"} />
      <ImageBackground
        source={require("../assets/images/copticBackground.png")}
        style={styles.backgroundImage}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  title: "Home",
                  headerShown: false,
                }}
              />
            </Stack>
          </PersistGate>
        </Provider>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: "cover",
    height: "100%",
    width: "100%",
  },
});
