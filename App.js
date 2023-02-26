import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import useFonts from "./helpers/useFonts";
import HomepageScreen from "./screens/HomepageScreen";
import BookScreen from "./screens/BookScreen";
import Colors from "./constants/colors";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "./screens/SettingsScreen";
import CustomDrawerScreen from "./screens/CustomDrawerScreen";
import { Provider } from "react-redux";
import { store } from "./stores/redux/store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

export default function App() {
  const { height, width } = useWindowDimensions();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await useFonts();
      } catch (e) {
        console.warn(e);
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

  function Root() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerScreen {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: Colors.NavigationBarColor },
          headerTintColor: "black",
          sceneContainerStyle: {
            backgroundColor: "transparent",
          },
          drawerContentStyle: { backgroundColor: Colors.NavigationBarColor },
          drawerActiveBackgroundColor: "white",
          drawerActiveTintColor: "black",
          swipeEdgeWidth: width,
        }}
      >
        <Drawer.Screen
          name="myHome"
          component={HomepageScreen}
          initialParams={{
            bookPath: "myHome",
            englishTitle: "7 Tunes",
          }}
          options={({ route, navigation }) => {
            const englishTitle = route.params.englishTitle;
            return {
              title: englishTitle,
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            };
          }}
        />
        <Drawer.Screen
          component={SettingsScreen}
          name="SettingsScreen"
          options={{
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }
  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={require("./assets/images/copticBackground.png")}
        resizeMode="cover"
        style={[styles.backgroundimage]}
      >
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                animation: "none",
                headerStyle: { backgroundColor: Colors.NavigationBarColor },
                headerTintColor: "black",
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen
                name="Root"
                component={Root}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="HomepageScreen"
                component={HomepageScreen}
                initialParams={{
                  bookPath: "myHome",
                }}
                options={({ route, navigation }) => {
                  const englishTitle = route.params.englishTitle;
                  return {
                    title: englishTitle,
                  };
                }}
              />
              <Stack.Screen name="BookScreen" component={BookScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </ImageBackground>
    </SafeAreaView>
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
  header: {
    fontSize: 20,
  },
});
