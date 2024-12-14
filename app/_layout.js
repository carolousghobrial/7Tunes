import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../stores/redux/store.js";
import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={Platform.OS === "ios"} />
      <ImageBackground
        source={require("../assets/images/copticBackground.png")}
        resizeMode="cover"
        style={[styles.backgroundimage]}
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
  backgroundimage: {
    resizeMode: "cover",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
