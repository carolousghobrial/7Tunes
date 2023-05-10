import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  useWindowDimensions,
} from "react-native";

import AppTheme from "../settings/appTheme";
import FontSize from "../settings/fontSize";
import VisibleLangs from "../settings/visibleLangs";
import TodaysPrayer from "../settings/todaysPrayer";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import SearchBar from "../ViewTypes/SearchBar";
import MenuItem from "./MenuItem";
import MenuMainTitle from "./MenuMainTitle";
function ContentsModal({ route, navigation }) {
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const { width, height } = useWindowDimensions();
  const [initialIndex, setInitialIndex] = useState(null);
  const [contentsModalVisible, setcontentsModalVisible] = useState(false);
  const MainTitle = route.params.MainTitle;
  const { scrollToKey } = route.params;
  const menuData = route.params.menuData;
  const [currentData, setcurrentData] = useState(menuData);

  const initialKey = route.params.initialKey;

  const flatListRef = useRef();

  useEffect(() => {
    console.log(currentData);
    navigation.setOptions({
      headerShown: true,
      header: () => <MenuMainTitle item={MainTitle}></MenuMainTitle>,
    });
    setInitialIndex(initialKey);
  }, []);
  const handleSearch = (text) => {
    setSearchPhrase(text);
    const filteredData = menuData.filter(
      (item) =>
        item.EnglishTitle.toLowerCase().includes(text.toLowerCase()) ||
        item.ArabicTitle.includes(text) ||
        (item.CopticTitle !== undefined && item.CopticTitle.includes(text))
    );

    setcurrentData(filteredData);
  };
  return (
    <View style={styles.container}>
      <SearchBar
        setClicked={setClicked}
        searchPhrase={searchPhrase}
        handleSearch={handleSearch}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
      />
      <FlatList
        style={[
          {
            backgroundColor: getColor("NavigationBarColor"),
          },
        ]}
        data={currentData}
        renderItem={({ item }) => (
          <MenuItem
            item={item}
            highlightedIndex={initialKey}
            scrollToKey={scrollToKey}
          ></MenuItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  transparentView: {
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default ContentsModal;
