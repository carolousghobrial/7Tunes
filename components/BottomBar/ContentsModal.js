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
import MenuMainTitle from "./MenuMainTitle";

function ContentsModal({
  bottomSheetRef,
  snapPoints,
  currentTitle,
  visible,
  menuData,
  scrollToKey,
}) {
  const [clicked, setClicked] = useState(false);
  const flatListRef = useRef();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setcurrentData] = useState(menuData);
  const [initialIndex, setInitialIndex] = useState(null);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const { present, dismiss } = useBottomSheetModal();
  const TableOfContents = getLanguageValue("TableOfContents");

  const handleSearch = (text) => {
    setSearchPhrase(text);
    const filteredData = menuData.filter(
      (item) =>
        item.EnglishTitle.toLowerCase()?.includes(text.toLowerCase()) ||
        item.ArabicTitle?.includes(text) ||
        (item.CopticTitle !== undefined && item.CopticTitle?.includes(text))
    );
    setcurrentData(filteredData);
  };
  useEffect(() => {
    try {
      const foundItem = menuData.findIndex(
        (item) => item.EnglishTitle === currentTitle
      );
      setInitialIndex(foundItem);
    } catch (e) {
      Alert.alert(e);
    }
  }, [currentTitle]);

  const { width, height } = useWindowDimensions();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

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
  const onScrollToIndexFailed = (error) => {
    flatListRef.current.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: false,
    });
    setTimeout(() => {
      if (flatListRef.current !== null) {
        flatListRef.current.scrollToIndex({
          index: error.index,
          animated: false,
        });
      }
    }, 10);
  };
  return (
    <BottomSheetModal
      style={styles.container}
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      ref={bottomSheetRef}
      handleHeight={50}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
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
            HighlitedIndex={initialIndex}
            scrollToKey={scrollToKey}
          />
        )}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={currentData.length}
        initialScrollIndex={initialIndex}
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
