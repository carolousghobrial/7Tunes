import { StyleSheet } from "react-native";
import {
  View,
  Button,
  TextInput,
  Platform,
  Text,
  Image,
  Pressable,
} from "react-native";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
function RitualView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  let RitualColor = getColor("RitualColor");
  const testAlignText = Platform.OS === "ios" ? "justify" : "right";

  return (
    <View style={styles.bookView}>
      <View style={styles.textView}>
        <Text
          style={[
            styles.english,
            { fontSize: fontSize * 0.7, color: RitualColor },
          ]}
        >
          {item.English}
        </Text>
      </View>
      <View style={styles.textView}>
        <Text
          style={[
            styles.arabic,
            {
              fontSize: fontSize,
              color: RitualColor,
              textAlign: testAlignText,
            },
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
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "right",
  },
  arabic: {
    fontFamily: "arabicritual-font",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "english-font",
    textAlign: "justify",
  },
});

export default RitualView;
