import { StyleSheet } from "react-native";
import {
  View,
  Button,
  TextInput,
  ImageBackground,
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
import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

function TitleView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  let flex = "row";
  if (width < height) {
    // Portrait mode
    flex = "column";
  }
  //let regex = /2:15-3:25/i;
  const regex = /\d+/g;

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
          {item.English}
        </Text>
      </View>
      {item.Coptic !== undefined ? (
        <View style={styles.textView}>
          <Text
            style={[
              styles.coptic,
              { fontSize: fontSize * 1.2, color: getColor("LabelColor") },
            ]}
          >
            {item.Coptic}
          </Text>
        </View>
      ) : null}
      <View style={styles.textView}>
        <Text
          style={[
            styles.arabic,
            {
              fontSize: fontSize * 1.2,
              color: getColor("LabelColor"),
              flexDirection: "row-reverse",
            },
          ]}
        >
          {item.Arabic.replace(regex, (match) => {
            return Number(match).toLocaleString("ar-EG");
          })}
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
  },
  backgroundimage: {
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  textView: {
    flex: 1,
    margin: 2,
    justifyContent: "center",
  },
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "right",
    justifyContent: "center",
    textAlign: "center",
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "right",
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
export default memo(TitleView);
