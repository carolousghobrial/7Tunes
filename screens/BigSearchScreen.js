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

function BigSearchScreen() {
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState([]);

  function renderItems({ item }) {
    return (
      <View>
        <Text>{item.key}</Text>
        <Text>{item.part.English}</Text>
      </View>
    );
  }
  function handleSearch(text) {
    setSearchPhrase(text);
    console.log(text);
    const results = [];

    for (const key in bookPaths) {
      bookPaths[key].Hymn.map((item) => {
        if (item.English !== undefined && item.English.includes(text)) {
          results.push({ key: key, part: item });
        }
      });
    }

    setCurrentData(results);
  }
  const keyExtractor = (item, index) => `${index}`;

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
        keyExtractor={keyExtractor}
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
});

export default BigSearchScreen;
