import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { useSelector } from "react-redux";
import { getColor } from "../../helpers/SettingsHelpers.js";

function MelodyView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const englishVisible = useSelector((state) => state.settings.english);
  const arabicVisible = useSelector((state) => state.settings.arabic);
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

  const commonTextStyle = {
    fontSize,
    color: textColor,
  };

  return (
    <View style={styles.bookView}>
      {englishVisible && (
        <View style={styles.textView}>
          <Text style={[styles.english, commonTextStyle]}>{item.English}</Text>
        </View>
      )}

      {arabicVisible && (
        <View style={styles.textView}>
          <Text
            style={[
              styles.arabic,
              commonTextStyle,
              {
                textAlign: "right",
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
  arabic: {
    fontFamily: "arabic-font",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "english-font",
  },
});

export default React.memo(MelodyView);
