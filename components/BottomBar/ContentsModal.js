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
function ContentsModal({
  visible,
  closeModal,
  dataArray,
  initialKey,
  scrollToKey,
}) {
  const { width, height } = useWindowDimensions();
  const [initialIndex, setInitialIndex] = useState(null);
  const MainTitle = dataArray[0];
  const closest = dataArray.reduce((a, b) => {
    return Math.abs(b.key - initialKey) < Math.abs(a.key - initialKey) ? b : a;
  });
  const HighlitedIndex = dataArray.findIndex(
    (item) => item.key === closest.key
  );
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
    setInitialIndex(HighlitedIndex);
  });
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      supportedOrientations={[
        "portrait",
        "portrait-upside-down",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
    >
      <View style={[styles.container, wrapperStyle]}>
        <Pressable
          style={{ height: viewheight, width: viewwidth }}
          onPress={closeModal}
        ></Pressable>
        <View
          style={{
            height: viewheight,
            width: viewwidth,
            backgroundColor: getColor("NavigationBarColor"),
          }}
        >
          <MenuMainTitle item={MainTitle}></MenuMainTitle>
          <FlatList
            data={dataArray}
            ref={flatListRef}
            renderItem={({ item }) => (
              <MenuItem
                item={item}
                highlightedIndex={HighlitedIndex}
                scrollToKey={scrollToKey}
                closeModal={closeModal}
              ></MenuItem>
            )}
            initialScrollIndex={initialIndex}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  transparentView: {
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default ContentsModal;
