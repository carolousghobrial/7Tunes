import { StyleSheet } from "react-native";
import {
  View,
  Text,
  ImageBackground,
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
import React, { memo } from "react";
import { useSelector } from "react-redux";

function MainTitleView({ item }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const flex = "row";

  const commonTextStyle = {
    fontSize: fontSize * 1.5,
    color: getColor("LabelColor"),
    justifyContent: "center",
    textAlign: "center",
  };

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
          <Text style={[styles.english, commonTextStyle]}>{item.English}</Text>
        </View>
        {item.Coptic && (
          <View style={styles.textView}>
            <Text style={[styles.coptic, commonTextStyle]}>{item.Coptic}</Text>
          </View>
        )}
        <View style={styles.textView}>
          <Text style={[styles.arabic, commonTextStyle]}>{item.Arabic}</Text>
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
  },
  arabic: {
    fontFamily: "arabictitle-font",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "englishtitle-font",
  },
});

export default memo(MainTitleView);
