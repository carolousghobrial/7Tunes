import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import React from "react";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
function MelodyView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const textColor = getColorBySide(item.Side);
  const englishVisible = useSelector((state) => state.settings.english);
  const arabicVisible = useSelector((state) => state.settings.arabic);

  function getColorBySide(side) {
    switch (side) {
      case "North":
        return getColor("NorthColor");
      case "South":
        return getColor("SouthColor");
      case "Refrain":
        return getColor("RefrainColor");
      case "Priest":
        return getColor("PriestColor");
      case "Deacon":
        return getColor("DeaconColor");
      case "People":
        return getColor("PeopleColor");
      case "Reader":
        return getColor("ReaderColor");
      case "Title":
        return getColor("NorthColor");
      default:
        return "";
    }
  }

  const testAlignText = Platform.OS === "ios" ? "justify" : "right";

  return (
    <View style={styles.bookView}>
      {englishVisible && (
        <View style={styles.textView}>
          <Text style={[styles.english, { fontSize, color: textColor }]}>
            {item.English}
          </Text>
        </View>
      )}

      {arabicVisible && (
        <View style={styles.textView}>
          <Text
            style={[
              styles.arabic,
              {
                fontSize,
                color: textColor,
                textAlign: testAlignText,
                lineHeight: fontSize * 1.8,
              },
            ]}
          >
            {item.Arabic}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    width: "100%",
  },
  textView: {
    flex: 1,
    margin: 5,
  },
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "right",
    justifyContent: "flex-start",
  },
  arabic: {
    fontFamily: "arabic-font",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "english-font",
  },
});

export default React.memo(MelodyView);
