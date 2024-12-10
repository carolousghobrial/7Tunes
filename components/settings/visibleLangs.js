import { View, Switch, StyleSheet, Text, Image, FlatList } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { changeTextLanguage } from "../../stores/redux/settings.js";

import LangListItems from "./langListItem";
function VisibleLangs() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const english = useSelector((state) => state.settings.english);
  const coptic = useSelector((state) => state.settings.coptic);
  const arabic = useSelector((state) => state.settings.arabic);
  const copticenglish = useSelector((state) => state.settings.copticenglish);
  const copticarabic = useSelector((state) => state.settings.copticarabic);
  const arabicengishMelodies = useSelector(
    (state) => state.settings.arabicengishMelodies
  );
  const dispatch = useDispatch();
  const tempLang = [
    {
      titleKey: "english",
      descriptionKey: "englishdescription",
      isEnabled: english,
    },
    {
      titleKey: "coptic",
      descriptionKey: "copticarabicdescription",
      isEnabled: coptic,
    },
    {
      titleKey: "arabic",
      descriptionKey: "arabicdescription",
      isEnabled: arabic,
    },
    {
      titleKey: "copticenglish",
      descriptionKey: "copticenglishdescription",
      isEnabled: copticenglish,
    },
    {
      titleKey: "copticarabic",
      descriptionKey: "copticarabicdescription",
      isEnabled: copticarabic,
    },
    {
      titleKey: "arabicengishMelodies",
      descriptionKey: "arabicengishMelodiesdescription",
      isEnabled: arabicengishMelodies,
    },
  ];
  const [langArray, setLangArray] = useState(tempLang);
  function onSwitch(item, e) {
    dispatch(
      changeTextLanguage({ lang: item.titleKey, value: !item.titleKey })
    );
    const updatedArray = langArray.map((val, i) => {
      if (val.titleKey === item.titleKey) {
        item.isEnabled = e;
        return item;
      }
      return val;
    });
    setLangArray(updatedArray); // set the state to the updated copy
  }
  function renderItems(itemData) {
    return (
      <LangListItems
        incomingItem={itemData.item}
        onSwitch={onSwitch}
      ></LangListItems>
    );
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
      {langArray.map((lang) => {
        return (
          <LangListItems
            key={lang.titleKey}
            incomingItem={lang}
            onSwitch={onSwitch}
          ></LangListItems>
        );
      })}
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
