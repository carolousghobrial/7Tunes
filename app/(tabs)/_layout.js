import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import TopBoxView from "../../components/homepage/topBoxView";
import { getLanguageValue } from "../../helpers/SettingsHelpers";
import Purchases from "react-native-purchases";
import * as Updates from "expo-updates";
import { useState, useCallback, useEffect } from "react";

const TabsLayout = () => {
  const darkMode = useSelector((state) => state.settings.darkMode);
  const activeColors = darkMode ? Colors["dark"] : Colors["light"];

  const [hasUpdate, setHasUpdate] = useState(false);
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        setHasUpdate(update.isAvailable); // Set state to true if an update is available
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }

    checkForUpdates();
  }, []); // Run once when the component mounts
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColors.PrimaryColor,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: activeColors.NavigationBarColor,
            paddingBottom: Platform.OS === "android" ? 20 : 0, // Ensure padding for Android
          },
        ],

        headerTitleAlign: "left", // Align title to the left
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18, // Adjust font size here
          fontFamily: "english-font",
        },
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
            <View>
              <Ionicons name="settings" color={color} size={size} />
              {hasUpdate && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              )}
            </View>
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
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
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
