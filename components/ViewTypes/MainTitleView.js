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

function MainTitleView({ item }) {
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
      style={{
        borderColor: getColor("LabelColor"),
        backgroundColor: getColor("pageBackgroundColor"),
      }}
    >
      <ImageBackground
        source={require("../../assets/images/titleBackground.png")}
      >
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              { fontSize: fontSize * 1.5, color: getColor("LabelColor") },
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
                { fontSize: fontSize * 1.5, color: getColor("LabelColor") },
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
              { fontSize: fontSize * 1.5, color: getColor("LabelColor") },
            ]}
          >
            {item.Arabic}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
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
export default memo(MainTitleView);
