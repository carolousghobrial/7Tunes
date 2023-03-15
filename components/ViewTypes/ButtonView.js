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
import { getCopticDateString } from "../../helpers/copticMonthsHelper";
import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonRules from "../../helpers/buttonRules";
function ButtonView({ item }) {
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
    <Pressable
      onPress={ButtonRules.find((data) => data.title === item.rule).onPress}
    >
      <View style={[styles.bookView, { flexDirection: flex }]}>
        <Text style={[styles.english, { fontSize }]}> {item.English}</Text>
        <Text style={[styles.arabic, { fontSize }]}> {item.Arabic}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    backgroundColor: "red",
    borderWidth: 5,
    margin: 10,
  },

  english: {
    color: "black",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    color: "black",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ButtonView;
