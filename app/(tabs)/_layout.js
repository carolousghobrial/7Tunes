import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import TopBoxView from "../../components/homepage/topBoxView";
import { getLanguageValue } from "../../helpers/SettingsHelpers";
import Purchases from "react-native-purchases";
const TabsLayout = () => {
  const darkMode = useSelector((state) => state.settings.darkMode);
  const activeColors = darkMode ? Colors["dark"] : Colors["light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColors.PrimaryColor,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: activeColors.NavigationBarColor },
        ],
        headerTitleAlign: "left", // Align title to the left

        headerStyle: { backgroundColor: activeColors.NavigationBarColor },
        headerTintColor: activeColors.PrimaryColor,
        tabBarLabelStyle: styles.tabBarLabel,
        headerRight: () => <TopBoxView />, // Add TopBoxView here
      }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{
          bookPath: "myHome",
          englishTitle: "Home",
          arabicTitle: "الصفحة الرئيسية",
        }}
        options={{
          title: "Homepage",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: getLanguageValue("fullFeasts"),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cross" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: getLanguageValue("searchPage"),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saints"
        options={{
          title: getLanguageValue("saintsMenu"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cross-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colors.light.PrimaryColor, // Use light mode as default fallback
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default TabsLayout;
