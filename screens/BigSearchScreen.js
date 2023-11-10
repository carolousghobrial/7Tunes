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
      const highlightedText = method(item.part[key], searchPhrase);

      return (
        <Pressable onPress={openPage.bind(this, item, searchPhrase)}>
          <View style={styles.ReturnBox} key={item.listKey}>
            <Text style={styles.title}>{item.englishTitle}</Text>
            <Text>{highlightedText}</Text>
          </View>
        </Pressable>
      );
    }

    return null; // Or handle unsupported value
  }

  function openPage(item, searchPhrase) {
    navigation.push("ViewSingleHymnSearch", {
      path: item.key,
      searchPhrase: searchPhrase,
      partClicked: item.part.English,
      englishTitle: item.englishTitle,
      arabicTitle: item.arabicTitle,
    });
  }
  function HighlightText(textToHighlight, searchText) {
    const newSearch = searchText.trim();
    const regex = new RegExp(`(${newSearch})`, "gim");
    const parts = textToHighlight.split(regex);
    var key = 0;
    return (
      <Text>
        {parts.map((part) =>
          part.toLowerCase() === newSearch.toLowerCase() ? (
            <Text style={{ backgroundColor: "yellow" }} key={key++}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  }
  function handleSearch(text) {
    setSearchPhrase(text);
    const results = [];
    var listKeyNum = 0;
    for (const key in bookPaths) {
      bookPaths[key].Hymn.map((item) => {
        switch (value) {
          case "english":
            if (
              item.English !== undefined &&
              item.English.toLowerCase().includes(text.toLowerCase().trim())
            ) {
              listKeyNum++;
              results.push({
                key: key,
                part: item,
                englishTitle: bookPaths[key].EnglishTitle,
                arabicTitle: bookPaths[key].ArabicTitle,
                listKey: listKeyNum,
              });
            }
            break;
          case "coptic":
            if (
              item.Coptic !== undefined &&
              item.Coptic.includes(text.toLowerCase().trim())
            ) {
              listKeyNum++;
              results.push({
                key: key,
                part: item,
                englishTitle: bookPaths[key].EnglishTitle,
                arabicTitle: bookPaths[key].ArabicTitle,
                listKey: listKeyNum,
              });
            }
            break;
          case "arabic":
            if (
              item.Arabic !== undefined &&
              item.Arabic.includes(text.toLowerCase().trim())
            ) {
              listKeyNum++;
              results.push({
                key: key,
                part: item,
                englishTitle: bookPaths[key].EnglishTitle,
                arabicTitle: bookPaths[key].ArabicTitle,
                listKey: listKeyNum,
              });
            }
            break;
          case "copticarabic":
            if (
              item.Arabiccoptic !== undefined &&
              item.Arabiccoptic.includes(text.toLowerCase().trim())
            ) {
              listKeyNum++;
              results.push({
                key: key,
                part: item,
                englishTitle: bookPaths[key].EnglishTitle,
                arabicTitle: bookPaths[key].ArabicTitle,
                listKey: listKeyNum,
              });
            }
            break;
          case "copticenglish":
            if (
              item.Englishcoptic !== undefined &&
              item.Englishcoptic.includes(text.toLowerCase().trim())
            ) {
              listKeyNum++;
              results.push({
                key: key,
                part: item,
                englishTitle: bookPaths[key].EnglishTitle,
                arabicTitle: bookPaths[key].ArabicTitle,
                listKey: listKeyNum,
              });
            }
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
    marginHorizontal: 10,
    flex: 8,
  },
  ReturnBox: {
    borderWidth: 5,
    margin: 5,
    padding: 5,
  },
});

export default BigSearchScreen;
