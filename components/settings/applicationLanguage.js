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

  if (width > height) {
    flexDirection = "row";
  }

  const wrapperStyle = {
    flexDirection: flexDirection,
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
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>{getLanguageValue("applanguage")}</Text>
        <Text style={[styles.description, { fontSize: fontSize / 1.7 }]}>
          {getLanguageValue("applanguagedescription")}
        </Text>
      </View>
      <View style={[styles.wrapper, wrapperStyle]}>
        {languages.map((lang) => (
          <View key={lang.key} style={styles.language}>
            <Pressable onPress={() => changeLang(lang.key)}>
              <View style={styles.outter}>
                {mylanguage === lang.key && <View style={styles.inner} />}
              </View>

              <Text style={[styles.lang]}>{lang.text}</Text>
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
    flexDirection: "row",
    borderWidth: 5,
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
    fontSize: 24,
    fontFamily: "english-font",
  },
  description: {
    fontSize: 15,
    fontFamily: "english-font",
    textAlign: "justify",
    color: "gray",
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
    flexDirection: "row",
  },
  wrapper: {
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  inner: {
    width: 15,
    height: 15,
    backgroundColor: "black",
    padding: 4,
    borderRadius: 10,
  },
  outter: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: "black",
    padding: 2,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ApplicationLanguage;
