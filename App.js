import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import "expo-dev-client";
import * as SplashScreen from "expo-splash-screen";
import useFonts from "./helpers/useFonts";
import HomepageScreen from "./screens/HomepageScreen";
import BookScreen from "./screens/BookScreen";
import Colors from "./constants/colors";
import {
  setCurrentSeasonLive,
  isInFast,
  isWatos,
} from "./helpers/copticMonthsHelper";
import SettingsScreen from "./screens/SettingsScreen";
import CustomDrawerScreen from "./screens/CustomDrawerScreen";
import { Provider } from "react-redux";
import { store, persistor } from "./stores/redux/store";
import NavigationContainerView from "./components/homepage/NavigationContainerView";
import { useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Glassfy, GlassfySku } from "react-native-glassfy-module";
//import Purchases from "react-native-purchases";
import * as Updates from "expo-updates";
import * as ScreenOrientation from "expo-screen-orientation";

import { enableScreens } from "react-native-screens";
enableScreens(false);
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  //I18nManager.allowRTL(true);
  //I18nManager.forceRTL(true);
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await useFonts();
         await Glassfy.initialize("68561c8cc6994fb2af25a34a19a5554f", false);
        //Purchases.configure({ apiKey: "goog_ICeqiHcYzQRzROFBJsEVAAirhPX" });
        await ScreenOrientation.unlockAsync();

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "New Update!",
            "Please restart the app to apply updates",
            [
              {
                text: "Restart App",
                onPress: () => Updates.reloadAsync(),
              },
            ]
          );
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        //setCurrentSeason();
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" translucent={true} hidden={true} />
      <ImageBackground
        source={require("./assets/images/copticBackground.png")}
        resizeMode="cover"
        style={[styles.backgroundimage]}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainerView />
          </PersistGate>
        </Provider>
      </ImageBackground>
    </SafeAreaView>
  );
}
export default App;

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
