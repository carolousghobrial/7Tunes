import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ImageBackground,
  StyleSheet,
  Button,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import useFonts from "../../helpers/useFonts";
import HomepageScreen from "../../screens/HomepageScreen";
import BookScreen from "../../screens/BookScreen";
import LoadingScreen from "../../screens/LoadingScreen";
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
import {
  getCurrentSeason,
  isInFast,
  isWatos,
  getTodayDate,
  plantsSeason,
  getCopticDate,
} from "../../helpers/copticMonthsHelper";
import moment from "moment";
import Test from "../settings/test.js";
import { setSeason } from "../../stores/redux/settings.js";
import ContentsModal from "../BottomBar/ContentsModal.js";
import { FontAwesome5 } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
function NavigationContainerView() {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();

  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const darkMode = useSelector((state) => state.settings.darkMode);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  let activeColors = darkMode === false ? Colors["light"] : Colors["dark"];
  function getWeeksSinceStartDate(startDate) {
    const now = new Date(); // Get the current date
    const msPerWeek = 1000 * 60 * 60 * 24 * 7; // Number of milliseconds in a week
    const diffInMs = now.getTime() - startDate.getTime(); // Difference in milliseconds between now and start date
    const diffInWeeks = Math.ceil(diffInMs / msPerWeek); // Round down to get number of full weeks
    return diffInWeeks;
  }
  function setCurrentSeason() {
    const mySeason = getCurrentSeason(timeTransition)[0];
    const currentDate = new Date(getTodayDate(timeTransition));
    const copticDate = getCopticDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    var mycurrentSeason = {
      key: mySeason.key,
      start: mySeason.start,
      end: mySeason.end,
      major: mySeason.major,
      week: getWeeksSinceStartDate(new Date(mySeason.start)),
      dayOfWeek: currentDate.getDay(),
      isWatos: isWatos(),
      type: mySeason.type,
      plantsSeason: plantsSeason(),
      copticMonth: copticDate.month,
      copticDay: copticDate.day,
      copticYear: copticDate.year,
    };
    dispatch(setSeason({ currentSeason: mycurrentSeason }));
  }
  useEffect(() => {
    // Simulate app loading time
    setCurrentSeason();
  });
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
        <Drawer.Screen
          component={Test}
          name="Test"
          options={{
            title: "Test",

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
        <Stack.Screen name="ContentsScreen" component={ContentsModal} />
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
