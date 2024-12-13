import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../stores/redux/store.js";
import { Text, View, StatusBar, useWindowDimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useCallback, useEffect } from "react";
import useFonts from "../helpers/useFonts.js";
import { useNavigationState } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

export default function RootLayout({ children }) {
  const navigationStack = useNavigationState((state) => state.routes);

  useEffect(() => {
    async function prepare() {
      try {
        await useFonts();
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey: "appl_ZaFObrSSGpHIPXcBxgCOYckdVpP",
          });
        } else {
          await Purchases.configure({
            apiKey: "goog_ICeqiHcYzQRzROFBJsEVAAirhPX",
          });
        }
      } catch (e) {
        console.warn("Error during initialization:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar hidden={Platform.OS === "ios"} />
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
  );
}
