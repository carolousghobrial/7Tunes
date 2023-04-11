import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";

function LoadingScreen() {
  var pageBackgroundColor = getColor("pageBackgroundColor");
  let labelColor = getColor("LabelColor");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: pageBackgroundColor,
      }}
    >
      <Image
        style={styles.image}
        source={require("../assets/images/logofinal.png")}
      />

      <ActivityIndicator style={{ flex: 2 }} size="large" color={labelColor} />
    </View>
  );
}
export default LoadingScreen;
const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 5,
  },
  image: {
    flex: 8,
    height: "50%",
    borderRadius: 100 / 2,
    overflow: "hidden",
  },
  textView: {
    flex: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});
