import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import { Ionicons } from "@expo/vector-icons";
function CustomHeader({ navigation, english, coptic, arabic }) {
  let NavigationBarColor = getColor("NavigationBarColor");

  return (
    <View style={[styles.header, { backgroundColor: NavigationBarColor }]}>
      <Pressable style={styles.closeView} onPress={() => navigation.pop()}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={getColor("LabelColor")}
        />
      </Pressable>

      <View style={styles.titleView}>
        <Text
          style={[styles.englishheaderTitle, { color: getColor("LabelColor") }]}
        >
          {english}
        </Text>
        <Text
          style={[styles.copticheaderTitle, { color: getColor("LabelColor") }]}
        >
          {coptic}
        </Text>

        <Text
          style={[styles.arabicheaderTitle, { color: getColor("LabelColor") }]}
        >
          {arabic}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  closeView: {
    flex: 1,
  },
  titleView: {
    flex: 9,
  },
  englishheaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
  },
  arabicheaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "arabictitle-font",
  },
  copticheaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "coptic-font",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default CustomHeader;
