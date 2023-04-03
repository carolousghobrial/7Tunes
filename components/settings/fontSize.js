import { View, Switch, StyleSheet, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import moment from "moment";
import Colors from "../../constants/colors.js";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import { useDispatch, useSelector } from "react-redux";
import { changeFontSize } from "../../stores/redux/settings.js";
function FontSize() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const dispatch = useDispatch();
  //const [fontSize, setFontSize] = useState(24);
  const language = useSelector((state) => state.settings.appLanguage);

  let flexDirection = "row";
  if (language === "ara") {
    flexDirection = "row-reverse";
  }
  function fontSizePlus() {
    dispatch(changeFontSize({ direction: "plus" }));
  }
  function fontSizeMinus() {
    dispatch(changeFontSize({ direction: "minus" }));
  }
  return (
    <View style={[styles.container, { borderColor: getColor("PrimaryColor") }]}>
      <View style={[styles.switchView, { flexDirection: flexDirection }]}>
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("fontsizelabel")}
          </Text>

          <Text
            style={[styles.fontsizestyle, { color: getColor("PrimaryColor") }]}
          >
            {fontSize}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.buttonBox} onPress={fontSizePlus}>
            <View>
              <Text style={styles.copticText}>A</Text>
            </View>
          </Pressable>
          <Pressable style={styles.buttonBox} onPress={fontSizeMinus}>
            <View>
              <Text style={styles.copticText}>a</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 5,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
  },
  titleView: {
    flex: 2,
  },
  fontsizestyle: {
    fontSize: 50,
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontSize: 15,
    fontFamily: "english-font",

    color: "gray",
  },
  switchView: {
    flexDirection: "row",
    margin: 5,
    padding: 5,
  },
  buttonsContainer: {
    flex: 1,
  },
  buttonBox: {
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: Colors.NavigationBarColor,
    margin: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
  },
  copticText: {
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "coptic-font",
    fontSize: 30,
  },
});

export default FontSize;
