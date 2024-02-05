import React, { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../components/ViewTypes/SearchBar";
import bookPaths from "../helpers/bookPathsHelpers";
import DropDownPicker from "react-native-dropdown-picker";
import { getLanguageValue } from "../helpers/SettingsHelpers";

import {
  changeBishopIsPresent,
  changeismorethan3BishopPresent,
} from "../stores/redux/settings.js";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";

function BigSearchScreen({ navigation }) {
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("english");
  const [items, setItems] = useState([
    { label: getLanguageValue("english"), value: "english" },
    { label: getLanguageValue("coptic"), value: "coptic" },
    { label: getLanguageValue("arabic"), value: "arabic" },
    { label: getLanguageValue("copticarabic"), value: "copticarabic" },
    { label: getLanguageValue("copticenglish"), value: "copticenglish" },
  ]);

  function renderItems({ item }) {
    const getItemValues = {
      english: {
        key: "English",
        method: HighlightText,
      },
      coptic: {
        key: "Coptic",
        method: HighlightText,
      },
      arabic: {
        key: "Arabic",
        method: HighlightText,
      },
      copticarabic: {
        key: "Arabiccoptic",
        method: HighlightText,
      },
      copticenglish: {
        key: "Englishcoptic",
        method: HighlightText,
      },
    };

    const { key, method } = getItemValues[value] || {};

    if (key && method) {
      const highlightedText = method(item.part[key], searchPhrase, key);
      title =
        item[key.toLowerCase() + "Title"] === undefined
          ? item["englishTitle"]
          : item[key.toLowerCase() + "Title"];
      return (
        <Pressable onPress={OpenPageButtonRule.bind(this, item, searchPhrase)}>
          <View style={styles.ReturnBox} key={item.listKey}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text>{highlightedText}</Text>
          </View>
        </Pressable>
      );
    }

    return null; // Or handle unsupported value
  }

  function OpenPageButtonRule(item, searchPhrase) {
    navigation.push("ViewSingleHymnSearch", {
      path: item.key,
      searchPhrase: searchPhrase,
      partClicked: item.part.English,
      englishTitle: item.englishTitle,
      arabicTitle: item.arabicTitle,
    });
  }
  function HighlightText(textToHighlight, searchText, key) {
    const font = key === "Coptic" ? "coptic-font" : "english-font";

    const newSearch = searchText.trim();
    const regex = new RegExp(`(${newSearch})`, "gim");
    const parts = textToHighlight.split(regex);

    return (
      <Text style={{ fontFamily: font, fontSize: 20 }}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={{
              backgroundColor:
                part.toLowerCase() === newSearch.toLowerCase()
                  ? "yellow"
                  : "transparent",
              fontFamily: font,
            }}
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  }

  function handleSearch(text) {
    setSearchPhrase(text);
    if (text === "") {
      return;
    }
    const results = [];
    let listKeyNum = 0;

    for (const key in bookPaths) {
      bookPaths[key].Hymn.forEach((item) => {
        const textLower = text.toLowerCase().trim();

        const checkAndPush = (property) => {
          if (
            item[property] !== undefined &&
            item[property].toLowerCase().includes(textLower)
          ) {
            listKeyNum++;
            results.push({
              key,
              part: item,
              englishTitle: bookPaths[key].EnglishTitle,
              arabicTitle: bookPaths[key].ArabicTitle,
              listKey: listKeyNum,
            });
          }
        };

        switch (value) {
          case "english":
            checkAndPush("English");
            break;
          case "coptic":
            checkAndPush("Coptic");
            break;
          case "arabic":
            checkAndPush("Arabic");
            break;
          case "copticarabic":
            checkAndPush("Arabiccoptic");
            break;
          case "copticenglish":
            checkAndPush("Englishcoptic");
            break;
          default:
            break;
        }
      });
    }

    setCurrentData(results);
  }

  return (
    <View>
      <SearchBar
        setClicked={setClicked}
        searchPhrase={searchPhrase}
        handleSearch={handleSearch}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
      />
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      <FlatList
        data={currentData}
        keyExtractor={(item, index) => {
          return item.listKey;
        }}
        renderItem={renderItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
  },
  closeButton: {
    alignItems: "flex-end",
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 25,
  },
  titleBox: {
    marginHorizontal: 10,
    borderBottomWidth: 5,
    borderBottomColor: "black",
    flex: 8,
  },
  ReturnBox: {
    margin: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // semi-transparent background
  },
});

export default BigSearchScreen;
