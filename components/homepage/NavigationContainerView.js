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
import ViewSingleHymn from "../../screens/ViewSingleHymn";
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
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import Test from "../settings/test.js";
import { setSeason, setIsTablet } from "../../stores/redux/settings.js";
import ContentsModal from "../BottomBar/ContentsModal.js";
import SettingsModal from "../BottomBar/SettingsModal.js";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Device from "expo-device";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
function NavigationContainerView() {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();

  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);

  const darkMode = useSelector((state) => state.settings.darkMode);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  let activeColors = darkMode === false ? Colors["light"] : Colors["dark"];
  useEffect(() => {
    async function prepare() {
      try {
        if (todayPrayer) {
          dispatch(
            setSeason({ currentSeason: setCurrentSeasonLive(timeTransition) })
          );
        }
        dispatch(
          setIsTablet({
            isTablet: (await Device.getDeviceTypeAsync()) === 2 ? true : false,
          })
        );
        console.log(isTablet);
      } catch (e) {}
    }
    prepare();
  }, []);
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
            title: getLanguageValue("fullFeasts"),

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

          gestureEnabled: true,
          gestureDirection: "horizontal",
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
        <Stack.Screen name="ContentsModal" component={ContentsModal} />
        <Stack.Screen name="SettingsModal" component={SettingsModal} />
        <Stack.Screen name="ViewSingleHymn" component={ViewSingleHymn} />
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
