import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { getColor, getLanguageValue } from "../../helpers/SettingsHelpers.js";
import { AntDesign } from "@expo/vector-icons";

import SearchBar from "../ViewTypes/SearchBar";
import MenuItem from "./MenuItem";

function ContentsModal({
  bottomSheetRef,
  snapPoints,
  currentTitle,
  visible,
  menuData,
  scrollToKey,
}) {
  const [clicked, setClicked] = useState(false);
  const flatListRef = useRef(null);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState(menuData);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const { present, dismiss } = useBottomSheetModal();
  const TableOfContents = getLanguageValue("TableOfContents");

  useEffect(() => {
    try {
      const foundItem = menuData.findIndex(
        (item) =>
          item.EnglishTitle === currentTitle ||
          item.ArabicTitle === currentTitle ||
          (item.CopticTitle !== undefined && item.CopticTitle === currentTitle)
      );
      flatListRef.current.scrollToIndex({
        index: foundItem,
        animated: false,
      });
    } catch (e) {
      console.error(e);
    }
  }, [currentTitle]);

  const { width, height } = useWindowDimensions();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

  const handleSearch = (text) => {
    setSearchPhrase(text);
    const filteredData = menuData.filter(
      (item) =>
        item.EnglishTitle.toLowerCase().includes(text.toLowerCase()) ||
        item.ArabicTitle.includes(text) ||
        (item.CopticTitle !== undefined && item.CopticTitle.includes(text))
    );
    setCurrentData(filteredData);
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      style={styles.container}
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      ref={bottomSheetRef}
      handleHeight={50}
      index={0}
      snapPoints={snapPoints}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: labelColor }]}>
          {TableOfContents}
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => bottomSheetRef.current.dismiss()}
        >
          <AntDesign name="closecircle" size={30} color={labelColor} />
        </Pressable>
      </View>
      <SearchBar
        setClicked={setClicked}
        searchPhrase={searchPhrase}
        handleSearch={handleSearch}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
      />
      <FlatList
        style={[styles.flatList, { backgroundColor: NavigationBarColor }]}
        ref={flatListRef}
        data={currentData}
        renderItem={({ item, index }) => (
          <MenuItem
            item={item}
            index={index}
            HighlitedIndex={currentTitle === item.EnglishTitle ? index : -1}
            scrollToKey={scrollToKey}
          />
        )}
        initialNumToRender={currentData.length}
        keyExtractor={(item, index) => index.toString()}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
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
    flex: 8,
    marginHorizontal: 10,
  },
  flatList: {
    flex: 1,
  },
});

export default ContentsModal;
