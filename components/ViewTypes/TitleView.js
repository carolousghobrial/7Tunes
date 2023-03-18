import { StyleSheet } from "react-native";
import {
  View,
  Button,
  TextInput,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function TitleView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  let flex = "row";
  if (width > height) {
    // Landscape mode
    flex = "row";
  } else {
    // Portrait mode
    flex = "column";
  }
  return (
    <View
      style={[
        styles.bookView,
        { flexDirection: flex, borderColor: getColor("LabelColor") },
      ]}
    >
      <View style={styles.textView}>
        <Text
          style={[
            styles.english,
            { fontSize: fontSize * 1.2, color: getColor("LabelColor") },
          ]}
        >
          {item.english}
        </Text>
      </View>
      {item.coptic !== undefined ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.coptic,
              { fontSize: fontSize * 1.2, color: getColor("LabelColor") },
            ]}
          >
            {item.coptic}
          </Text>
        </View>
      ) : null}
      <View style={styles.textView}>
        <Text
          style={[
            styles.arabic,
            { fontSize: fontSize * 1.2, color: getColor("LabelColor") },
          ]}
        >
          {item.arabic}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    margin: 5,
    borderRadius: 30,
    borderWidth: 5,
    borderStyle: "dashed",
  },
  textView: {
    flex: 1,
    margin: 2,
    justifyContent: "center",
  },
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "justify",
    justifyContent: "center",
    textAlign: "center",
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "justify",
    writingDirection: "rtl",
    justifyContent: "center",
    textAlign: "center",
  },
  english: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default TitleView;
