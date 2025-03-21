import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";
import React, { memo } from "react";
import { getColor } from "../../helpers/SettingsHelpers.js";

function BaseView({ item, mykey }) {
  const { textFontSize, ...languageSettings } = useSelector(
    (state) => state.settings
  );

  const getTextColor = (side) => {
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
    return getColor(sideColors[side] || "NorthColor");
  };

  const baseTextStyle = {
    fontSize: textFontSize,
    flex: 1,
    margin: 5,
    color: getTextColor(item.Side),
  };

  const stylesByLanguage = {
    English: { fontFamily: "english-font", lineHeight: textFontSize * 1.25 },
    Coptic: { fontFamily: "coptic-font", lineHeight: textFontSize * 1.3 },
    Arabic: {
      fontFamily: "arabic-font",
      lineHeight: textFontSize * 1.8,
      textAlign: "right",
      writingDirection: "rtl",
    },
    Englishcoptic: {
      fontFamily: "english-font",
      lineHeight: textFontSize * 1.25,
    },
    Arabiccoptic: {
      fontFamily: "arabic-font",
      lineHeight: textFontSize * 1.4,
      textAlign: "right",
      writingDirection: "rtl",
    },
  };

  return (
    <View style={styles.bookView}>
      {Object.entries(stylesByLanguage).map(
        ([key, style]) =>
          languageSettings[key.toLowerCase()] && (
            <Text key={key} style={[baseTextStyle, style]}>
              {item[key]}
            </Text>
          )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    width: "100%",
    flexDirection: "row",
  },
});

export default memo(BaseView);
