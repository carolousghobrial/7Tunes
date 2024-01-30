import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
} from "react-native";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../stores/redux/settings.js";

function ApplicationLanguage() {
  const mylanguage = useSelector((state) => state.settings.appLanguage);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();

  let flexDirection = "column";
  let containerflexDirection = "row";

  if (width > height) {
    flexDirection = "row";
  }

  const wrapperStyle = {
    flexDirection: flexDirection,
    color: getColor("PrimaryColor"),
  };
  const languages = [
    { key: "ara", text: getLanguageValue("arabic") },
    { key: "eng", text: getLanguageValue("english") },
  ];
  function changeLang(key) {
    if (mylanguage != key) {
      dispatch(changeLanguage({ appLanguage: key }));
    }
  }
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: getColor("PrimaryColor"),
          flexDirection: containerflexDirection,
        },
      ]}
    >
      <View style={styles.titleView}>
        <Text
          style={[
            styles.title,
            { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
          ]}
        >
          {getLanguageValue("applanguage")}
        </Text>
        <Text
          style={[
            styles.description,
            { fontSize: fontSize / 1.8, color: getColor("PrimaryColor") },
          ]}
        >
          {getLanguageValue("applanguagedescription")}
        </Text>
      </View>
      <View
        style={[
          styles.wrapper,
          wrapperStyle,
          { color: getColor("PrimaryColor") },
        ]}
      >
        {languages.map((lang) => (
          <View key={lang.key} style={styles.language}>
            <Pressable onPress={() => changeLang(lang.key)}>
              <View
                style={[
                  styles.outter,
                  { borderColor: getColor("PrimaryColor") },
                ]}
              >
                {mylanguage === lang.key && (
                  <View
                    style={[
                      styles.inner,
                      { backgroundColor: getColor("PrimaryColor") },
                    ]}
                  />
                )}
              </View>

              <Text style={[styles.lang, { color: getColor("PrimaryColor") }]}>
                {lang.text}
              </Text>
            </Pressable>
          </View>
        ))}
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
  },
  titleView: {
    flex: 1,
    margin: 5,
  },
  description: {
    fontFamily: "english-font",
    color: "black",
    fontStyle: "italic",
  },
  fontsizestyle: {
    fontSize: 50,
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontFamily: "english-font",

    color: "gray",
    fontStyle: "italic",
  },
  lang: {
    textTransform: "capitalize",
    fontFamily: "english-font",
  },
  text: {
    fontSize: 20,
    flex: 1,
    marginBottom: 10,
    fontFamily: "english-font",
    justifyContent: "center",
    alignItems: "center",
  },
  language: {
    margin: 15,
    alignItems: "center",
  },
  wrapper: {
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  inner: {
    width: 15,
    height: 15,
    padding: 4,
    borderRadius: 10,
  },
  outter: {
    width: 20,
    height: 20,
    borderWidth: 3,
    padding: 2,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ApplicationLanguage;
