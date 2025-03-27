import React from "react";
import {
  View,
  Switch,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { changeDarkMode } from "../../stores/redux/settings.js";

function AppTheme() {
  const { height, width } = useWindowDimensions();
  const darkMode = useSelector((state) => state.settings.darkMode);
  const language = useSelector((state) => state.settings.appLanguage);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const dispatch = useDispatch();

  const toggleSwitch = () => dispatch(changeDarkMode());

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: getColor("PrimaryColor"),
          backgroundColor: getColor("NavigationBarColor"),
        },
      ]}
    >
      <View
        style={[
          styles.switchView,
          { flexDirection: width > height ? "row" : "column" },
        ]}
      >
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
              styles.description,
              { fontSize: fontSize / 1.8, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("backgroundselectordescription")}
          </Text>
        </View>

        <View style={styles.switch}>
          <View style={styles.textContainer}>
            <Text style={[styles.text, { color: getColor("PrimaryColor") }]}>
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
    borderWidth: 2,
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
  text: {
    fontFamily: "english-font",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AppTheme;
