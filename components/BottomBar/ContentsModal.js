import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
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

import MenuItem from "./MenuItem";
import MenuMainTitle from "./MenuMainTitle";
function ContentsModal({ route, navigation }) {
  const { width, height } = useWindowDimensions();
  const [initialIndex, setInitialIndex] = useState(null);
  const [contentsModalVisible, setcontentsModalVisible] = useState(false);
  const MainTitle = route.params.MainTitle;
  const { scrollToKey } = route.params;
  const menuData = route.params.menuData;
  const initialKey = route.params.initialKey;

  const flatListRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <MenuMainTitle item={MainTitle}></MenuMainTitle>,
    });
    setInitialIndex(initialKey);
  }, []);
  return (
    <FlatList
      style={[
        styles.container,
        {
          backgroundColor: getColor("NavigationBarColor"),
        },
      ]}
      data={menuData}
      ref={flatListRef}
      initialNumToRender={menuData.data}
      renderItem={({ item }) => (
        <MenuItem
          item={item}
          highlightedIndex={initialKey}
          scrollToKey={scrollToKey}
        ></MenuItem>
      )}
      initialScrollIndex={initialIndex}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  transparentView: {
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default ContentsModal;
