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
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
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
  let flexDirection = "column";
  let viewheight = "50%";
  let viewwidth = "100%";

  if (width > height) {
    flexDirection = "row";
    viewheight = "100%";
    viewwidth = "50%";
  }
  const wrapperStyle = {
    flexDirection: flexDirection,
  };
  const flatListRef = useRef();

  useEffect(() => {
    console.log(initialKey);
    setInitialIndex(initialKey);
  }, []);
  return (
    <View style={[styles.container, wrapperStyle]}>
      <View
        style={{
          backgroundColor: getColor("NavigationBarColor"),
        }}
      >
        <MenuMainTitle item={MainTitle}></MenuMainTitle>
        <FlatList
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  transparentView: {
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default ContentsModal;
