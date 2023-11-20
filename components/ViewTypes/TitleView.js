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
import images from "../../helpers/imageHelpers";

import { Entypo } from "@expo/vector-icons";

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

function TitleView({ item, navigation }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  const isSwitchGregorian =
    item.Switch !== undefined && item.Switch.toLowerCase().includes("gregory");
  let flex = "row";
  let Switchflex = "column";
  if (width < height) {
    // Portrait mode
    flex = "column";
    Switchflex = "row";
  }
  //let regex = /2:15-3:25/i;
  const regex = /\d+/g;
  function switchLiturgies() {
    if (item.Switch !== undefined) {
      if (isSwitchGregorian) {
        navigation.replace("BookScreen", {
          bookPath: "liturgyofStGregory",
          Switch: item.Switch,
        });
      } else {
        navigation.replace("BookScreen", {
          bookPath: "liturgyofStBasil",
          Switch: item.Switch,
        });
      }
    }
  }
  return (
    <View
      style={[
        styles.bookView,
        { flexDirection: flex, borderColor: getColor("LabelColor") },
      ]}
    >
      <View style={{ flex: 8 }}>
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              { fontSize: fontSize * 1.13, color: getColor("LabelColor") },
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
                { fontSize: fontSize * 1.13, color: getColor("LabelColor") },
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
                fontSize: fontSize * 1.13,
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
      {item.Switch !== undefined ? (
        <Pressable
          style={{
            alignContent: "center",
            margin: 5,
          }}
          onPress={switchLiturgies}
        >
          {isSwitchGregorian ? (
            <View style={[styles.switchView, { flexDirection: Switchflex }]}>
              <Image
                style={styles.image}
                source={images["liturgyofStGregory"]}
              />
              <View style={[styles.swapTextView, { flexDirection: flex }]}>
                <Entypo name="swap" size={24} color="black" />
                <Text
                  style={[styles.SwitchText, { color: getColor("LabelColor") }]}
                >
                  St.Gregory
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.switchView, { flexDirection: Switchflex }]}>
              <Image style={styles.image} source={images["liturgyofStBasil"]} />
              <View style={[styles.swapTextView, { flexDirection: flex }]}>
                <Entypo name="swap" size={24} color="black" />
                <Text
                  style={[styles.SwitchText, { color: getColor("LabelColor") }]}
                >
                  St.Basil
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      ) : null}
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
  swapTextView: {
    flex: 7,
  },
  SwitchText: {
    fontFamily: "english-font",
    fontSize: 24,
    fontStyle: "italic",
    justifyContent: "center",
    alignContent: "center",
  },
  image: {
    flex: 2,
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    marginHorizontal: 10,
    height: 60,
    borderRadius: 100 / 2,
    overflow: "hidden",
    resizeMode: "stretch",
  },
  switchView: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  textView: {
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
