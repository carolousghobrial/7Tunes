import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../stores/redux/store";
import { StatusBar, ImageBackground, StyleSheet, Platform } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";
import useFonts from "../helpers/useFonts";
import Colors from "../constants/colors";

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

  const activeColors = Colors.light;
  useEffect(() => {
    initializeApp(setAppIsReady);
  }, []);

  if (!appIsReady) return null; // Add a loading screen if needed

  return (
    <ImageBackground
      source={require("../assets/images/copticBackground.png")}
      style={styles.backgroundImage}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack
            screenOptions={{
              tabBarActiveTintColor: activeColors.PrimaryColor,
              tabBarStyle: [
                styles.tabBar,
                {
                  backgroundColor: activeColors.NavigationBarColor,
                  paddingBottom: Platform.OS === "android" ? 20 : 0,
                },
              ],
              title: "",
              headerTitleAlign: "left",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: "english-font",
              },
              headerStyle: { backgroundColor: activeColors.NavigationBarColor },
              headerTintColor: activeColors.PrimaryColor,
              tabBarLabelStyle: styles.tabBarLabel,
            }}
          >
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
