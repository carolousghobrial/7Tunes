import React from "react";
import { View, Switch, StyleSheet, Text } from "react-native";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors.js";
import { useDispatch, useSelector } from "react-redux";

function LangListItem({ incomingItem, onSwitch }) {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.appLanguage);
  const primaryColor = getColor("PrimaryColor");
  return (
    <View style={[styles.container, { borderColor: primaryColor }]}>
      <View style={styles.textview}>
        <Text style={[styles.text, { color: primaryColor }]}>
          {getLanguageValue(incomingItem.titleKey)}
        </Text>
        <Text style={[styles.text, { color: primaryColor }]}>
          {getLanguageValue(incomingItem.descriptionKey)}
        </Text>
      </View>
      <View style={styles.switch}>
        <Text
          style={[
            incomingItem.isEnabled ? styles.textOn : styles.textOff,
            { color: getColor("PrimaryColor") },
          ]}
        >
          {incomingItem.isEnabled ? "YES" : "NO"}
        </Text>
        <Switch
          ios_backgroundColor={
            incomingItem.isEnabled ? Colors.NavigationBarColor : "#AA4A44"
          }
          value={incomingItem.isEnabled}
          onValueChange={(e) => onSwitch(incomingItem, e)}
          thumbColor="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    flexDirection: "row",
  },
  textview: {
    flex: 4,
  },
  text: {
    fontFamily: "english-font",
  },
  switch: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 5,
  },
  textOn: {
    fontFamily: "english-font",
    fontWeight: "bold",
    color: "black",
  },
  textOff: {
    fontFamily: "english-font",
    fontWeight: "bold",
    color: "black",
  },
});

export default LangListItem;
