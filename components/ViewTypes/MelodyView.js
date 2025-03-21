import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getColor } from "../../helpers/SettingsHelpers.js";

function MelodyView({ item }) {
  const { textFontSize, arabicengishMelodies, english, arabic } = useSelector(
    (state) => state.settings
  );

  const textColor = getColorBySide(item.Side);

  function getColorBySide(side) {
    const sideColors = {
      North: "NorthColor",
      South: "SouthColor",
      Refrain: "RefrainColor",
      Priest: "PriestColor",
      Deacon: "DeaconColor",
      People: "PeopleColor",
      Reader: "ReaderColor",
      Title: "NorthColor",
    };
    return getColor(sideColors[side] || "NorthColor");
  }

  const commonTextStyle = { fontSize: textFontSize, color: textColor };

  const stylesByLanguage = {
    English: { fontFamily: "english-font", lineHeight: textFontSize * 1.5 },
    Arabic: {
      fontFamily: "arabic-font",
      textAlign: "right",
      fontWeight: "bold",
      writingDirection: "rtl",
      lineHeight: textFontSize * 1.8,
    },
    ArabicEnglish: {
      fontFamily: "english-font",
      lineHeight: textFontSize * 1.5,
    },
  };

  const languages = [
    { key: "English", visible: english && item.English },
    { key: "Arabic", visible: arabic && item.Arabic },
    {
      key: "ArabicEnglish",
      visible: arabicengishMelodies && item.ArabicEnglish,
    },
  ];

  return (
    <View style={styles.bookView}>
      {languages.map(
        ({ key, visible }) =>
          visible && (
            <View key={key} style={styles.textView}>
              <Text style={[commonTextStyle, stylesByLanguage[key]]}>
                {item[key]}
              </Text>
            </View>
          )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  textView: {
    flex: 1,
    margin: 5,
    maxWidth: "100%",
  },
});

export default React.memo(MelodyView);
