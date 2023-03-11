import React, { useState } from "react";
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
function ContentsModal({ visible, closeModal, dataArray, scrollToKey }) {
  const { width, height } = useWindowDimensions();
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
          <FlatList
            data={dataArray}
            renderItem={({ item }) => (
              <MenuItem
                item={item}
                scrollToKey={scrollToKey}
                closeModal={closeModal}
              ></MenuItem>
            )}
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
