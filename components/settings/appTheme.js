import {
  View,
  Switch,
  StyleSheet,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import Languages from "../../constants/languages.js";
import { changeDarkMode } from "../../stores/redux/settings.js";

function AppTheme() {
  const { height, width } = useWindowDimensions();
  const darkMode = useSelector((state) => state.settings.darkMode);
  const language = useSelector((state) => state.settings.appLanguage);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  let flexDirection = "row";

  const dispatch = useDispatch();
  const toggleSwitch = () => dispatch(changeDarkMode());

  return (
    <View style={[styles.container, { borderColor: getColor("PrimaryColor") }]}>
      <View style={[styles.switchView, { flexDirection: flexDirection }]}>
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("backgroundselector")}
          </Text>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize / 1.8, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("backgroundselectordescription")}
          </Text>
        </View>
        <View style={styles.switch}>
          <View style={styles.textContainer}>
            <Text
              style={[
                darkMode ? [styles.textOn] : [styles.textOff],
                { color: getColor("PrimaryColor") },
              ]}
            >
              {darkMode ? getLanguageValue("dark") : getLanguageValue("light")}
            </Text>
          </View>
          <Switch
            trackColor={{
              false: getColor("NavigationBarColor"),
              true: getColor("SecondaryColor"),
            }}
            ios_backgroundColor={
              darkMode
                ? getColor("SecondaryColor")
                : getColor("NavigationBarColor")
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
    fontFamily: "english-font",
  },
  switchView: {
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
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  textOff: {
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AppTheme;
