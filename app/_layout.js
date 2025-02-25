import React, { useEffect, useState, useCallback } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../stores/redux/store";
import {
  StatusBar,
  ImageBackground,
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import useFonts from "../helpers/useFonts";

const API_KEY =
  Platform.OS === "ios"
    ? "appl_ZaFObrSSGpHIPXcBxgCOYckdVpP"
    : "goog_ICeqiHcYzQRzROFBJsEVAAirhPX";

const configurePurchases = async () => {
  try {
    await Purchases.configure({ apiKey: API_KEY });
  } catch (error) {
    console.error("Error configuring Purchases:", error);
  }
};

export default function RootLayout({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);

  const initializeApp = useCallback(async () => {
    try {
      await useFonts();
      await configurePurchases();
    } catch (error) {
      console.error("Error during initialization:", error);
    } finally {
      setAppIsReady(true);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (!appIsReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
                options={{ title: "Home", headerShown: false }}
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
    flex: 1,
    resizeMode: "cover",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
