import { StyleSheet } from "react-native";
import { View, Button, TextInput, Text, Image, Pressable } from "react-native";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
function RitualView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  let RitualColor = getColor("RitualColor");

  return (
    <View style={styles.bookView}>
      <View style={styles.textView}>
        <Text
          style={[
            styles.english,
            { fontSize: fontSize * 0.7, color: RitualColor },
          ]}
        >
          {item.english}
        </Text>
      </View>
      <View style={styles.textView}>
        <Text
          style={[styles.arabic, { fontSize: fontSize, color: RitualColor }]}
        >
          {item.arabic}
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
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "justify",
  },
  arabic: {
    fontFamily: "arabicritual-font",
    textAlign: "justify",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "english-font",
    textAlign: "justify",
  },
});

export default RitualView;
