import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import "expo-dev-client";
import * as TaskManager from "expo-task-manager";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import useFonts from "./helpers/useFonts";
import HomepageScreen from "./screens/HomepageScreen";
import BookScreen from "./screens/BookScreen";
import Colors from "./constants/colors";
import { isInFast, isWatos } from "./helpers/copticMonthsHelper";
import SettingsScreen from "./screens/SettingsScreen";
import CustomDrawerScreen from "./screens/CustomDrawerScreen";
import { Provider } from "react-redux";
import { store, persistor } from "./stores/redux/store";
import NavigationContainerView from "./components/homepage/NavigationContainerView";
import { useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Glassfy, GlassfySku } from "react-native-glassfy-module";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { setSeason } from "./stores/redux/settings.js";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as BackgroundFetch from "expo-background-fetch";

const TASK_NAME = "notification-task";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

if (!TaskManager.isTaskDefined(TASK_NAME)) {
  TaskManager.defineTask(TASK_NAME, async () => {
    console.debug("notification task running...");

    // API call and some conditions would go here

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Title!",
        body: "Test",
      },
      trigger: null,
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  });
}

try {
  console.debug("registering notification task...");
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60 * 15, // 15 minutes
    startOnBoot: true,
    stopOnTerminate: false,
  });
} catch (err) {
  console.debug("registering notification task failed:", err);
}

enableScreens(false);
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const sendScheduledNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Scheduled Notification",
        body: "This is a scheduled notification!",
      },
      trigger: new Date(moment().add(10, "seconds")), // Send the notification after 5 seconds
    });
  };
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "2021c9d7-dd0b-4c29-8a9d-da78153a1d49",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await useFonts();
        sendScheduledNotification();
        await ScreenOrientation.unlockAsync();
        await Glassfy.initialize("68561c8cc6994fb2af25a34a19a5554f", false);
        await registerForPushNotificationsAsync().then((token) => {
          console.log(token);
          setExpoPushToken(token);
        });
      } catch (e) {
      } finally {
        // Tell the application to render
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
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
