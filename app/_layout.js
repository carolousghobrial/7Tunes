import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../stores/redux/store.js";
import { Text, View, StatusBar, useWindowDimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import Colors from "../constants/colors";
import CustomDrawerScreen from "../screens/CustomDrawerScreen.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useCallback, useEffect } from "react";
import { Glassfy } from "react-native-glassfy-module";
import useFonts from "../helpers/useFonts.js";
import { useNavigationState } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { I18nManager } from "react-native";
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

I18nManager.allowRTL(true);

export default function RootLayout({ children }) {
  const navigationStack = useNavigationState((state) => state.routes);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Manage dropdown visibility
  const BookScreenAvail = navigationStack.some(
    (item) => item.name === "BookScreen" && item.params !== undefined
  );

  const { width, height } = useWindowDimensions();
  useEffect(() => {
    async function prepare() {
      try {
        await useFonts();
        //await Glassfy.initialize("68561c8cc6994fb2af25a34a19a5554f", false);
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey: "appl_ZaFObrSSGpHIPXcBxgCOYckdVpP",
          });
        } else {
          await Purchases.configure({
            apiKey: "goog_ICeqiHcYzQRzROFBJsEVAAirhPX",
          });
        }
        const offerings = await Purchases.getOfferings();

        console.log(offerings);
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
        <StatusBar hidden />

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
