import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import TopBoxView from "../../components/homepage/topBoxView";
import { getLanguageValue } from "../../helpers/SettingsHelpers";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TabsLayout = () => {
  const darkMode = useSelector((state) => state.settings.darkMode);
  const activeColors = darkMode ? Colors.dark : Colors.light;

  // Define common screen options
  const screenOptions = {
    tabBarActiveTintColor: activeColors.PrimaryColor,
    tabBarStyle: [
      styles.tabBar,
      {
        backgroundColor: activeColors.NavigationBarColor,
        paddingBottom: Platform.OS === "android" ? 20 : 0,
      },
    ],

    headerTitleAlign: "left",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 18,
      fontFamily: "english-font",
    },
    headerStyle: { backgroundColor: activeColors.NavigationBarColor },
    headerTintColor: activeColors.PrimaryColor,
    tabBarLabelStyle: styles.tabBarLabel,
    headerRight: () => <TopBoxView />,
  };

  // Tab configuration
  const tabs = [
    {
      name: "index",
      options: {
        title: "",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      },
      initialParams: {
        bookPath: "myHome",
        englishTitle: "Home",
        arabicTitle: "الصفحة الرئيسية",
      },
    },
    {
      name: "settings",
      options: {
        title: "Settings",
        tabBarIcon: ({ color, size }) => (
          <View>
            <Ionicons name="settings" color={color} size={size} />
          </View>
        ),
      },
    },
    {
      name: "calendar",
      options: {
        title: getLanguageValue("fullFeasts"),
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="cross" size={24} color={color} />
        ),
      },
    },
    {
      name: "search",
      options: {
        title: getLanguageValue("searchPage"),
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="search" size={24} color={color} />
        ),
      },
    },
    {
      name: "saints",
      options: {
        title: getLanguageValue("saintsMenu"),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="cross-outline"
            size={24}
            color={color}
          />
        ),
      },
    },
  ];

  // Wrapper for Android Safe Area
  const Wrapper = Platform.OS === "android" ? SafeAreaView : React.Fragment;
  const wrapperProps = Platform.OS === "android" ? { style: { flex: 1 } } : {};

  return (
    <SafeAreaProvider>
      <Wrapper {...wrapperProps}>
        <Tabs screenOptions={screenOptions}>
          {tabs.map(({ name, options, initialParams }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={options}
              initialParams={initialParams}
            />
          ))}
        </Tabs>
      </Wrapper>
    </SafeAreaProvider>
  );
};

// Styles
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
    borderColor: Colors.light.PrimaryColor,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default TabsLayout;
