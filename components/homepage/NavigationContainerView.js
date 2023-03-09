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
import useFonts from "../../helpers/useFonts";
import HomepageScreen from "../../screens/HomepageScreen";
import BookScreen from "../../screens/BookScreen";
import Colors from "../../constants/colors";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "../../screens/SettingsScreen";
import CustomDrawerScreen from "../../screens/CustomDrawerScreen";
import FullFeastsScreen from "../../screens/FullFeastsScreen";
import { Provider } from "react-redux";
import { store } from "../../stores/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import { FontAwesome5 } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
function NavigationContainerView() {
  const { height, width } = useWindowDimensions();
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const darkMode = useSelector((state) => state.settings.darkMode);

  let activeColors = darkMode === false ? Colors["light"] : Colors["dark"];

  function Root() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerScreen {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: activeColors.NavigationBarColor },
          headerTintColor: activeColors.PrimaryColor,
          sceneContainerStyle: {
            backgroundColor: "transparent",
          },
          drawerContentStyle: {
            backgroundColor: activeColors.NavigationBarColor,
          },
          drawerActiveBackgroundColor: activeColors.PrimaryColor,
          drawerActiveTintColor: activeColors.SecondaryColor,
          swipeEdgeWidth: width,
        }}
      >
        <Drawer.Screen
          name="myHome"
          component={HomepageScreen}
          initialParams={{
            bookPath: "myHome",
            englishTitle: "7 Tunes",
            arabicTitle: "7 Tunes",
          }}
          options={({ route, navigation }) => {
            const englishTitle = route.params.englishTitle;
            const arabicTitle = route.params.arabicTitle;

            return {
              title: appLanguage === "eng" ? englishTitle : arabicTitle,
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
            title: getLanguageValue("settings"),

            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          component={FullFeastsScreen}
          name="FullFeastsScreen"
          options={{
            title: "Full Feasts",

            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="cross" size={24} color="black" />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: "none",
          headerStyle: {
            backgroundColor: activeColors.NavigationBarColor,
          },
          headerTintColor: activeColors.PrimaryColor,
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
            const arabicTitle = route.params.arabicTitle;
            return {
              title: appLanguage === "eng" ? englishTitle : arabicTitle,
            };
          }}
        />
        <Stack.Screen name="BookScreen" component={BookScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
  },
});

export default NavigationContainerView;
