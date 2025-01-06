import React, { forwardRef, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import { getColor, getLanguageValue } from "../../helpers/SettingsHelpers.js";
import MenuItem from "./MenuItem";

const ContentsModal = ({
  bottomSheetRef,
  currentKey,
  menuData,
  contentsClose,
  scrollToKey,
}) => {
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const TableOfContents = getLanguageValue("TableOfContents");

  // Filter menuData once
  const filteredMenuData = menuData.filter(
    (item) => item.ArabicTitle || item.EnglishTitle
  );

  // Memoized function for scrolling to a specific key
  const scrollToMenuKey = useCallback(
    (item) => {
      scrollToKey(item);
    },
    [scrollToKey]
  );

  // Backdrop customization
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
      ref={bottomSheetRef}
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      handleHeight={50}
      snapPoints={["90%"]}
      backdropComponent={renderBackdrop}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: labelColor }]}>
          {TableOfContents}
        </Text>
        <Pressable style={styles.closeButton} onPress={contentsClose}>
          <AntDesign name="closecircle" size={30} color={labelColor} />
        </Pressable>
      </View>

      {/* FlatList Section */}
      <BottomSheetFlatList
        style={[styles.flatList, { backgroundColor: NavigationBarColor }]}
        data={filteredMenuData}
        renderItem={({ item, index }) => (
          <MenuItem
            item={item}
            index={index}
            HighlitedIndex={currentKey}
            scrollToKey={() => scrollToMenuKey(item)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={filteredMenuData.length}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeButton: {
    marginHorizontal: 10,
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 25,
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
});

export default ContentsModal;
