import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getColor } from "../../helpers/SettingsHelpers.js";

function MelodyView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const arabicengishMelodies =
    useSelector((state) => state.settings.arabicengishMelodies) &&
    item.ArabicEnglish !== undefined;
  const englishVisible =
    useSelector((state) => state.settings.english) &&
    item.English !== undefined;
  const arabicVisible = useSelector((state) => state.settings.arabic);
  const textColor = getColorBySide(item.Side);
  //console.log();
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

  const commonTextStyle = {
    fontSize,
    color: textColor,
  };

  return (
    <View style={styles.bookView}>
      {englishVisible && (
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              commonTextStyle,
              {
                lineHeight: fontSize * 1.5,
                flex: 1,
              },
            ]}
          >
            {item.English}
          </Text>
        </View>
      )}

      {arabicVisible && (
        <View style={[styles.textView, { flex: 1 }]}>
          {/* Ensure it expands */}
          <Text
            style={[
              styles.arabic,
              commonTextStyle,
              {
                textAlign: "right",
                lineHeight: fontSize * 1.8,
                flex: 1,
              },
            ]}
          >
            {item.Arabic}
          </Text>
        </View>
      )}
      {arabicengishMelodies && (
        <View style={[styles.textView, { flex: 1 }]}>
          {/* Ensure it expands */}
          <Text
            style={[
              styles.english,
              commonTextStyle,
              {
                lineHeight: fontSize * 1.5,
                flex: 1,
              },
            ]}
          >
            {item.ArabicEnglish}
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
    flexWrap: "wrap", // Allow content to wrap if it exceeds width
  },
  textView: {
    flex: 1,
    margin: 5,
    maxWidth: "100%", // Prevent overflow and keep text within bounds
  },

  english: {
    fontFamily: "english-font",
  },
});

export default React.memo(MelodyView);
