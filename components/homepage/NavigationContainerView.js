import React, { useEffect } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useWindowDimensions, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Device from "expo-device";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";
import HomepageScreen from "../../screens/HomepageScreen";
import VenerationSelectionScreen from "../../screens/VenerationSelectionScreen";
import BookScreen from "../../screens/BookScreen";
import Onboarding from "../../screens/OnBoardingScreen.js";
import ViewSingleHymn from "../../screens/ViewSingleHymn";
import ViewSingleHymnSearch from "../../screens/ViewSingleHymnSearch";
import LoadingScreen from "../../screens/LoadingScreen";
import Colors from "../../constants/colors";
import SettingsScreen from "../../screens/SettingsScreen";
import CustomDrawerScreen from "../../screens/CustomDrawerScreen";
import FullFeastsScreen from "../../screens/FullFeastsScreen";
import BigSearchScreen from "../../screens/BigSearchScreen";
import SaintsList from "../settings/saintsList";
import ContentsModal from "../BottomBar/ContentsModal.js";
import SettingsModal from "../BottomBar/SettingsModal.js";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function NavigationContainerView({ dispatch }) {
  const { height, width } = useWindowDimensions();

  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const darkMode = useSelector((state) => state.settings.darkMode);

  const activeColors = darkMode === false ? Colors["light"] : Colors["dark"];

  function Root() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerScreen {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: activeColors.NavigationBarColor },
          headerTintColor: activeColors.PrimaryColor,
          sceneContainerStyle: { backgroundColor: "transparent" },
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
            englishTitle: "Homepage",
            arabicTitle: "الصفحة الرئيسية",
          }}
          options={({ route, navigation }) => {
            const { englishTitle, arabicTitle } = route.params;
            return {
              title: appLanguage === "eng" ? englishTitle : arabicTitle,
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            };
          }}
        />
        <Drawer.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            title: getLanguageValue("settings"),
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="FullFeastsScreen"
          component={FullFeastsScreen}
          options={{
            title: getLanguageValue("fullFeasts"),
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="cross" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="BigSearchScreen"
          component={BigSearchScreen}
          options={{
            title: getLanguageValue("searchPage"),
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="search" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="SaintsList"
          component={SaintsList}
          options={{
            title: getLanguageValue("saintsMenu"),
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cross-outline"
                size={24}
                color="black"
              />
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
          headerStyle: { backgroundColor: activeColors.NavigationBarColor },
          headerTintColor: activeColors.PrimaryColor,
          contentStyle: { backgroundColor: "transparent" },
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="7 Tunes" component={Root} />
        <Stack.Screen
          name="HomepageScreen"
          component={HomepageScreen}
          initialParams={{
            bookPath: "myHome",
          }}
          options={({ route, navigation }) => {
            const { englishTitle, arabicTitle } = route.params;
            return {
              title: appLanguage === "eng" ? englishTitle : arabicTitle,
            };
          }}
        />
        <Stack.Screen name="BookScreen" component={BookScreen} />
        <Stack.Screen
          name="VenerationSelectionScreen"
          component={VenerationSelectionScreen}
        />
        <Stack.Screen name="ContentsModal" component={ContentsModal} />
        <Stack.Screen name="SettingsModal" component={SettingsModal} />
        <Stack.Screen name="ViewSingleHymn" component={ViewSingleHymn} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen
          name="ViewSingleHymnSearch"
          component={ViewSingleHymnSearch}
        />
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
