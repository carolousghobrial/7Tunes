import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = ({ navigation, english, coptic, arabic }) => {
  const navigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

  const handlePressBack = () => {
    navigation.pop();
  };

  return (
    <View style={[styles.header, { backgroundColor: navigationBarColor }]}>
      <Pressable style={styles.closeView} onPress={handlePressBack}>
        <Ionicons name="chevron-back" size={24} color={labelColor} />
      </Pressable>

      <View style={styles.titleView}>
        <Text style={[styles.headerTitle, { color: labelColor }]}>
          {english}
        </Text>
        <Text
          style={[styles.headerTitle, styles.coptic, { color: labelColor }]}
        >
          {coptic}
        </Text>
        <Text
          style={[styles.headerTitle, styles.arabic, { color: labelColor }]}
        >
          {arabic}
        </Text>
      </View>
    </View>
  );
};

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
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
  },
  arabic: {
    fontFamily: "arabictitle-font",
  },
  coptic: {
    fontFamily: "coptic-font",
  },
});

export default CustomHeader;
