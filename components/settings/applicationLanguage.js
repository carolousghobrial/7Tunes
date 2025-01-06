import React from "react";
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
  const { appLanguage: currentLanguage, textFontSize: fontSize } = useSelector(
    (state) => state.settings
  );
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();

  const flexDirection = width > height ? "row" : "column";
  const containerflexDirection = "row";

  const wrapperStyle = { flexDirection, color: getColor("PrimaryColor") };

  const languages = [
    { key: "ara", text: getLanguageValue("arabic") },
    { key: "eng", text: getLanguageValue("english") },
  ];

  const changeLang = (key) => {
    if (currentLanguage !== key) {
      dispatch(changeLanguage({ appLanguage: key }));
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: containerflexDirection,
          backgroundColor: getColor("NavigationBarColor"),
          borderColor: getColor("PrimaryColor"),
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

      <View style={[styles.wrapper, wrapperStyle]}>
        {languages.map(({ key, text }) => (
          <View key={key} style={styles.language}>
            <Pressable onPress={() => changeLang(key)}>
              <View
                style={[
                  styles.outter,
                  { borderColor: getColor("PrimaryColor") },
                ]}
              >
                {currentLanguage === key && (
                  <View
                    style={[
                      styles.inner,
                      { backgroundColor: getColor("PrimaryColor") },
                    ]}
                  />
                )}
              </View>
              <Text style={[styles.lang, { color: getColor("PrimaryColor") }]}>
                {text}
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
  },
  titleView: {
    flex: 1,
    margin: 5,
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
  wrapper: {
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  language: {
    margin: 15,
    alignItems: "center",
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
  inner: {
    width: 15,
    height: 15,
    padding: 4,
    borderRadius: 10,
  },
});

export default ApplicationLanguage;
