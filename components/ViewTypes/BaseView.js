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

  const getColorBySide = (side) => getColor(`${side}Color`);

  const getTextColor = (item) => {
    const sideColors = {
      North: "NorthColor",
      South: "SouthColor",
      Refrain: "RefrainColor",
      Priest: "PriestColor",
      Deacon: "DeaconColor",
      People: "PeopleColor",
      Reader: "ReaderColor",
      Title: "NorthColor",
      Neutral: mykey % 2 === 0 ? "NorthColor" : "SouthColor",
    };

    const side = sideColors[item.Side] || "NorthColor";
    return getColor(side);
  };

  const textStyle = {
    fontSize,
    flex: 1,
    lineHeight: fontSize * 1.1,
    margin: 5,
    fontFamily: "",
    justifyContent: "flex-start",
    color: getTextColor(item),
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
          <Text key={key} style={[textStyle, style]}>
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
