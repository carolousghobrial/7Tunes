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
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const [clicked, setClicked] = useState(false);
  const flatListRef = useRef(null);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState(menuData);
  const [initialIndex, setInitialIndex] = useState(null);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const TableOfContents = getLanguageValue("TableOfContents");
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    try {
      const foundItem = menuData.findIndex(
        (item) =>
          item.EnglishTitle === currentTitle ||
          item.ArabicTitle === currentTitle ||
          (item.CopticTitle !== undefined && item.CopticTitle === currentTitle)
      );
      if (foundItem !== -1) {
        setInitialIndex(foundItem);
      }
    } catch (e) {}
  }, [currentTitle]);
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

  const handleSearch = (text) => {
    try {
      const filteredData = menuData.filter(
        (item) =>
          item.EnglishTitle.toLowerCase().includes(text.toLowerCase()) ||
          item.ArabicTitle.includes(text) ||
          (item.CopticTitle !== undefined && item.CopticTitle.includes(text))
      );
      setCurrentData(filteredData);
    } catch (e) {}
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
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={menuData.length}
        initialScrollIndex={initialIndex}
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
