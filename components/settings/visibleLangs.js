import { View, Switch, StyleSheet, Text, FlatList } from "react-native";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { changeTextLanguage } from "../../stores/redux/settings.js";
import LangListItems from "./langListItem";

function VisibleLangs() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const languages = useSelector((state) => state.settings.languages); // Assuming the list is in redux
  const dispatch = useDispatch();

  const onSwitch = useCallback(
    (item, e) => {
      dispatch(changeTextLanguage({ lang: item.titleKey, value: e }));
    },
    [dispatch]
  );

  const renderItems = useCallback(
    ({ item }) => {
      return <LangListItems incomingItem={item} onSwitch={onSwitch} />;
    },
    [onSwitch]
  );

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
      <View style={styles.titleView}>
        <Text
          style={[
            styles.title,
            { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
          ]}
        >
          {getLanguageValue("languageselctor")}
        </Text>
        <Text style={[styles.description, { color: getColor("PrimaryColor") }]}>
          {getLanguageValue("todayprayerdescription")}
        </Text>
      </View>

      <FlatList
        data={languages} // Directly using the list from Redux
        keyExtractor={(item) => item.titleKey}
        renderItem={renderItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
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

export default VisibleLangs;
