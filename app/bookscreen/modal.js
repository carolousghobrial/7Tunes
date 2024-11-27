import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { getColor, getLanguageValue } from "../../helpers/SettingsHelpers.js";
import MenuItem from "../../components/BottomBar/MenuItem.js";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import { setBookScrollTo } from "../../stores/redux/book.js";

const ContentsModal = () => {
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const TableOfContents = getLanguageValue("TableOfContents");
  const router = useRouter();
  const dispatch = useDispatch();
  const { menuScrollTo } = useSelector((state) => state.book);

  // const { setindexToScrollTo } = useSearchParams();
  const { menuData, title } = useLocalSearchParams();
  const mymenuData = JSON.parse(menuData);

  const navigation = useNavigation();
  const menuFlatListRef = useRef(null);

  const [currentData, setCurrentData] = useState(
    mymenuData.filter((item) => item.ArabicTitle || item.EnglishTitle)
  );

  useEffect(() => {
    navigation.setOptions({
      title: title + " Menu",
      presentation: "modal",
      headerRight: () => (
        <Pressable
          onPressIn={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const scrollToMenuKey = (key) => {
    menuFlatListRef.current?.scrollToIndex({ animated: true, index: key });
  };
  useEffect(() => {
    if (menuScrollTo !== null && menuFlatListRef.current) {
      menuFlatListRef.current.scrollToIndex({
        index: menuScrollTo,
        animated: false,
      });
    }
  }, [menuScrollTo]);
  const scrollToKey = (item) => {
    dispatch(setBookScrollTo({ bookScrollTo: item.key }));
    router.back();
  };
  const onScrollToIndexFailed = (error) => {
    setTimeout(() => {
      if (menuFlatListRef.current !== null) {
        menuFlatListRef.current.scrollToIndex({
          index: error.index,
          animated: false,
        });
      }
    }, 10);
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={[styles.flatList, { backgroundColor: NavigationBarColor }]}
        data={currentData}
        initialScrollIndex={menuScrollTo}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => scrollToKey(item)}>
            <MenuItem item={item} index={index} HighlitedIndex={menuScrollTo} />
          </Pressable>
        )}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={mymenuData.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  closeButton: {
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "transparent", // Ensure no visual conflicts
  },
  closeButtonPressed: {
    opacity: 0.6, // Visual feedback on press
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "englishtitle-font",
    fontSize: 25,
    flex: 1,
    marginLeft: 10,
  },
  flatList: {
    flex: 1,
  },
});

export default ContentsModal;
