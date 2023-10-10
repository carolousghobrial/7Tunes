import React, { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../components/ViewTypes/SearchBar";
import bookPaths from "../helpers/bookPathsHelpers";

import { getColor, getLanguageValue } from "../helpers/SettingsHelpers.js";
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
  function renderItems({ item }) {
    const highlightedText = HighlightText(item.part.English, searchPhrase);

    return (
      <Pressable onPress={openPage.bind(this, item, searchPhrase)}>
        <View style={styles.ReturnBox} key={item.listKey}>
          <Text style={styles.title}>{item.englishTitle}</Text>
          <Text>{highlightedText}</Text>
        </View>
      </Pressable>
    );
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
    const regex = new RegExp(`(${searchText})`, "gim");
    const parts = textToHighlight.split(regex);
    var key = 0;
    return (
      <Text>
        {parts.map((part) =>
          part.toLowerCase() === searchText.toLowerCase() ? (
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
        if (item.English !== undefined && item.English.includes(text)) {
          listKeyNum++;
          results.push({
            key: key,
            part: item,
            englishTitle: bookPaths[key].EnglishTitle,
            arabicTitle: bookPaths[key].ArabicTitle,
            listKey: listKeyNum,
          });
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
