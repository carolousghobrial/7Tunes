import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getColor } from "../../helpers/SettingsHelpers.js";

function RitualView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const ritualColor = getColor("RitualColor");

  const commonTextStyle = { color: ritualColor };

  return (
    <View style={styles.bookView}>
      <View style={styles.textView}>
        <Text
          style={[
            styles.english,
            commonTextStyle,
            { fontSize: fontSize * 0.7 },
          ]}
        >
          {item.English}
        </Text>
      </View>
      <View style={styles.textView}>
        <Text
          style={[
            styles.arabic,
            commonTextStyle,
            { fontSize, textAlign: "right" },
          ]}
        >
          {item.Arabic}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    borderColor: "black",
    margin: 5,
    flexDirection: "row",
  },
  textView: {
    flex: 1,
    margin: 2,
  },
  arabic: {
    fontFamily: "arabicritual-font",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "english-font",
    textAlign: "left",
  },
});

export default React.memo(RitualView);
