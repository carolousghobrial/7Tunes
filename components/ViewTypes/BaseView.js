import { StyleSheet } from "react-native";
import { View, Button, TextInput, Text, Image, Pressable } from "react-native";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import React, { useState, useEffect, memo } from "react";
import {
  ComeRisenRule,
  ROICONCLUSION,
  REPLACEGOSPELAUTHOR,
  REPLACEPROPHETS,
} from "../../helpers/replacingRules";

function BaseView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
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
    default:
      break;
  }
  const englishVisible = useSelector((state) => state.settings.english);
  const copticVisible = useSelector((state) => state.settings.coptic);
  const arabicVisible = useSelector((state) => state.settings.arabic);
  const copticenglishVisible = useSelector(
    (state) => state.settings.copticenglish
  );
  const copticarabicVisible = useSelector(
    (state) => state.settings.copticarabic
  );

  return (
    <View style={styles.bookView}>
      {englishVisible ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              { fontSize, color: textColor, lineHeight: fontSize * 1.2 },
            ]}
          >
            {item.English}
          </Text>
        </View>
      ) : null}
      {copticVisible ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.coptic,
              { fontSize, color: textColor, lineHeight: fontSize * 1.2 },
            ]}
          >
            {item.Coptic}
          </Text>
        </View>
      ) : null}
      {arabicVisible ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.arabic,
              { fontSize, color: textColor, lineHeight: fontSize * 1.35 },
            ]}
          >
            {item.Arabic}
          </Text>
        </View>
      ) : null}
      {copticenglishVisible ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              { fontSize, color: textColor, lineHeight: fontSize * 1.2 },
            ]}
          >
            {item.Englishcoptic}
          </Text>
        </View>
      ) : null}
      {copticarabicVisible ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.arabic,
              { fontSize, color: textColor, lineHeight: fontSize * 1.2 },
            ]}
          >
            {item.Arabiccoptic}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",

    width: "100%",
  },
  eachPart: {
    flexDirection: "row",
  },
  textView: {
    flex: 1,
    margin: 5,
  },
  coptic: {
    fontFamily: "coptic-font",
    justifyContent: "flex-start",
  },
  arabic: {
    fontFamily: "arabic-font",
    textAlign: "justify",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "english-font",
  },
});

export default memo(BaseView);
