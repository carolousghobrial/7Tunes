import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../../components/ViewTypes/SearchBar.js";
import bookPaths from "../../helpers/bookPathsHelpers.js";
import DropDownPicker from "react-native-dropdown-picker";
import { getLanguageValue } from "../../helpers/SettingsHelpers.js";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import {
  changeBishopIsPresent,
  changeismorethan3BishopPresent,
} from "../../stores/redux/settings.js";

function BigSearchScreen() {
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("english");
  const [items] = useState([
    { label: getLanguageValue("english"), value: "english" },
    { label: getLanguageValue("coptic"), value: "coptic" },
    { label: getLanguageValue("arabic"), value: "arabic" },
    { label: getLanguageValue("copticarabic"), value: "copticarabic" },
    { label: getLanguageValue("copticenglish"), value: "copticenglish" },
  ]);

  const router = useRouter();

  const renderItem = useCallback(
    ({ item }) => {
      const getItemValues = {
        english: { key: "English", method: HighlightText },
        coptic: { key: "Coptic", method: HighlightText },
        arabic: { key: "Arabic", method: HighlightText },
        copticarabic: { key: "Arabiccoptic", method: HighlightText },
        copticenglish: { key: "Englishcoptic", method: HighlightText },
      };

      const { key, method } = getItemValues[value] || {};

      if (key && method) {
        const highlightedText = method(item.part[key], searchPhrase, key);
        const title = item[key.toLowerCase() + "Title"] || item["englishTitle"];

        return (
          <Pressable onPress={() => OpenPageButtonRule(item, searchPhrase)}>
            <View style={styles.ReturnBox} key={item.listKey}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <Text>{highlightedText}</Text>
            </View>
          </Pressable>
        );
      }

      return null;
    },
    [searchPhrase, value]
  );

  const OpenPageButtonRule = (item, searchPhrase) => {
    router.push({
      pathname: "/bookscreen/ViewSingleHymnSearch",
      params: {
        path: item.key,
        searchPhrase,
        partClicked: item.part.English,
        englishTitle: item.englishTitle,
        arabicTitle: item.arabicTitle,
      },
    });
  };

  const HighlightText = (textToHighlight, searchText, key) => {
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
  };

  const handleSearch = useCallback(
    (text) => {
      setSearchPhrase(text);
      if (text.trim() === "") {
        setCurrentData([]);
        return;
      }

      const results = [];
      let listKeyNum = 0;
      const textLower = text.toLowerCase().trim();

      Object.keys(bookPaths).forEach((key) => {
        bookPaths[key].Hymn.forEach((item) => {
          const checkAndPush = (property) => {
            if (
              item[property] &&
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
      });

      setCurrentData(results);
    },
    [value]
  );

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
      />
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.listKey.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
