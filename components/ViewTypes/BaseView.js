import { StyleSheet } from "react-native";
import { View, Text, Platform } from "react-native";
import { useSelector } from "react-redux";
import React, { memo } from "react";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
function BaseView({ item, mykey }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const languageSettings = useSelector((state) => state.settings);

  let textColor = "";

  switch (item.Side) {
    case "North":
      textColor = getColor("NorthColor");
      break;
    case "South":
      textColor = getColor("SouthColor");
      break;
    case "Refrain":
      textColor = getColor("RefrainColor");
      break;
    case "Priest":
      textColor = getColor("PriestColor");
      break;
    case "Deacon":
      textColor = getColor("DeaconColor");
      break;
    case "People":
      textColor = getColor("PeopleColor");
      break;
    case "Reader":
      textColor = getColor("ReaderColor");
      break;
    case "Title":
      textColor = getColor("NorthColor");
      break;
    case "Neutral":
      if (mykey % 2 == 0) {
        textColor = getColor("NorthColor");
      } else {
        textColor = getColor("SouthColor");
      }
      break;
    default:
      textColor = getColor("NorthColor");
      break;
  }
  const textStyle = {
    fontSize,
    flex: 1,
    lineHeight: fontSize * 1.2,
    margin: 5,
    fontFamily: "",
    justifyContent: "flex-start",
    color: textColor,
  };
  const testAlignText = Platform.OS === "ios" ? "justify" : "right";

  const arabicStyle = {
    fontFamily: "arabic-font",
    lineHeight: fontSize * 1.6,
    textAlign: testAlignText,
    writingDirection: "rtl",
  };
  const arabicCopticStyle = {
    fontFamily: "arabic-font",
    lineHeight: fontSize * 1.2,
    textAlign: testAlignText,
    writingDirection: "rtl",
  };

  const languages = [
    {
      key: "English",
      style: styles.english,
      isVisible: languageSettings.english,
    },
    { key: "Coptic", style: styles.coptic, isVisible: languageSettings.coptic },
    { key: "Arabic", style: arabicStyle, isVisible: languageSettings.arabic },
    {
      key: "Englishcoptic",
      style: styles.english,
      isVisible: languageSettings.copticenglish,
    },
    {
      key: "Arabiccoptic",
      style: arabicCopticStyle,
      isVisible: languageSettings.copticarabic,
    },
  ];

  return (
    <View style={[styles.bookView, { flexDirection: "row" }]}>
      {languages.map(({ key, style, isVisible }) =>
        isVisible ? (
          <Text
            key={key}
            style={[textStyle, style, { color: textStyle.color }]}
          >
            {item[key]}
          </Text>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    width: "100%",
  },
  coptic: {
    fontFamily: "coptic-font",
  },

  english: {
    fontFamily: "english-font",
  },
});

export default memo(BaseView);
