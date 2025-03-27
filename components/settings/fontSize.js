import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeFontSize } from "../../stores/redux/settings.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors.js";

function FontSize() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const dispatch = useDispatch();

  function fontSizePlus() {
    dispatch(changeFontSize({ direction: "plus" }));
  }
  function fontSizeMinus() {
    dispatch(changeFontSize({ direction: "minus" }));
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: getColor("PrimaryColor"),
          backgroundColor: getColor("NavigationBarColor"),
        },
      ]}
    >
      <View style={styles.switchView}>
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
            <Text style={styles.copticText}>A</Text>
          </Pressable>
          <Pressable style={styles.buttonBox} onPress={fontSizeMinus}>
            <Text style={styles.copticText}>a</Text>
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
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    borderWidth: 2,
  },
  titleView: {
    flex: 2,
  },
  fontsizestyle: {
    fontSize: 50,
    fontFamily: "english-font",
    textAlign: "center",
  },
  title: {
    fontFamily: "english-font",
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
    alignItems: "center",
    backgroundColor: Colors.NavigationBarColor,
    margin: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
  },
  copticText: {
    fontFamily: "coptic-font",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FontSize;
