import { View, Switch, StyleSheet, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { changeDarkMode } from "../../stores/redux/settings.js";

function AppTheme() {
  const fontSize = useSelector((state) => state.settings.textFontSize);

  const darkMode = useSelector((state) => state.settings.darkMode);

  const dispatch = useDispatch();
  const toggleSwitch = () => dispatch(changeDarkMode());

  return (
    <View style={styles.container}>
      <View style={styles.switchView}>
        <View style={styles.titleView}>
          <Text style={[styles.title, { fontSize }]}>Dark Mode</Text>
          <Text style={[styles.title, { fontSize: fontSize / 1.7 }]}>
            Today's Prayer options allows the application to automatically load
            the prayers/hymns said today rather than loading all the possible
            options
          </Text>
        </View>
        <View style={styles.switch}>
          <View style={styles.textContainer}>
            <Text
              style={
                darkMode
                  ? [styles.textOn, { fontSize }]
                  : [styles.textOff, { fontSize }]
              }
            >
              {darkMode ? "Dark" : "Light"}
            </Text>
          </View>
          <Switch
            trackColor={darkMode ? "black" : Colors.pageBackgroundColor}
            ios_backgroundColor={
              darkMode ? "black" : Colors.pageBackgroundColor
            }
            value={darkMode}
            onValueChange={toggleSwitch}
            thumbColor="white"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",

    borderWidth: 5,
  },
  titleView: {
    flex: 2,
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontSize: 15,
    fontFamily: "english-font",
    textAlign: "justify",
    color: "gray",
  },
  switchView: {
    flexDirection: "row",
    margin: 5,
    padding: 5,
  },
  switch: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
  },
  textOn: {
    color: "black",
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  textOff: {
    color: "black",
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AppTheme;
