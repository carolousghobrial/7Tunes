import { View, Switch, StyleSheet, Text, Image, FlatList } from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors.js";
import { useDispatch, useSelector } from "react-redux";
import { changeTextLanguage } from "../../stores/redux/settings.js";

function LangListItem(props) {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.appLanguage);

  let flexDirection = "row";

  return (
    <View
      style={[
        styles.container,
        { flexDirection: flexDirection, borderColor: getColor("PrimaryColor") },
      ]}
    >
      <View style={styles.textview}>
        <Text style={[styles.text, { color: getColor("PrimaryColor") }]}>
          {getLanguageValue(props.incomingItem.titleKey)}
        </Text>
        <Text style={[styles.text, { color: getColor("PrimaryColor") }]}>
          {getLanguageValue(props.incomingItem.descriptionKey)}
        </Text>
      </View>
      <View style={styles.switch}>
        <View style={styles.textContainer}>
          <Text
            style={[
              props.incomingItem.isEnabled ? [styles.textOn] : [styles.textOff],
              { color: getColor("PrimaryColor") },
            ]}
          >
            {props.incomingItem.isEnabled ? "YES" : "NO"}
          </Text>
        </View>
        <Switch
          ios_backgroundColor={
            props.incomingItem.isEnabled ? Colors.NavigationBarColor : "#AA4A44"
          }
          value={props.incomingItem.isEnabled}
          onValueChange={(e) => props.onSwitch(props.incomingItem, e)}
          thumbColor="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 5,
    borderWidth: 5,
  },
  textview: {
    flex: 4,
  },
  text: {
    fontFamily: "english-font",
  },
  titleView: {
    flex: 2,
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontFamily: "english-font",

    color: "gray",
    fontStyle: "italic",
  },
  switchView: {
    flexDirection: "row",
    margin: 5,
    flex: 1,
    padding: 5,
  },
  switch: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
  },
  textOn: {
    color: "black",
    fontFamily: "english-font",

    fontWeight: "bold",
  },
  textOff: {
    color: "black",
    fontFamily: "english-font",

    fontWeight: "bold",
  },
});

export default LangListItem;
