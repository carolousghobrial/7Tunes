import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useCallback,
} from "react";
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

const ContentsModal = forwardRef(
  (
    { bottomSheetRef, currentKey, menuData, contentsClose, scrollToKey },
    ref
  ) => {
    const NavigationBarColor = getColor("NavigationBarColor");
    const labelColor = getColor("LabelColor");
    const [currentData, setCurrentData] = useState(
      menuData.filter((item) => item.ArabicTitle || item.EnglishTitle)
    );
    const flatListRef = useRef(null);
    const appLanguage = useSelector((state) => state.settings.appLanguage);
    const TableOfContents = getLanguageValue("TableOfContents");

    const scrollToMenuKey = (key) => {
      scrollToKey(key);
    };

    useImperativeHandle(ref, () => ({
      scrollToMenuKey: (key) => {
        flatListRef.current?.scrollToIndex({ animated: true, index: key });
      },
    }));

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
        handleHeight={50}
        ref={bottomSheetRef}
        snapPoints={["90%"]}
        backdropComponent={renderBackdrop}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: labelColor }]}>
            {TableOfContents}
          </Text>
          <Pressable style={styles.closeButton} onPress={contentsClose}>
            <AntDesign name="closecircle" size={30} color={labelColor} />
          </Pressable>
        </View>

        <BottomSheetFlatList
          style={[styles.flatList, { backgroundColor: NavigationBarColor }]}
          ref={flatListRef}
          data={currentData}
          renderItem={({ item, index }) => (
            <MenuItem
              item={item}
              index={index}
              HighlitedIndex={currentKey}
              scrollToKey={scrollToMenuKey}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={menuData.length}
        />
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 25,
    flex: 1,
    marginHorizontal: 10,
  },
  flatList: {
    flex: 1,
  },
});

export default ContentsModal;
