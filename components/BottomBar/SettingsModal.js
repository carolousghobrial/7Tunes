import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  StyleSheet,
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

function SettingsModal() {
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
    <View style={[styles.container, wrapperStyle]}>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: getColor("NavigationBarColor"),
        }}
      >
        <ScrollView>
          <AppTheme></AppTheme>
          <FontSize></FontSize>
          <VisibleLangs></VisibleLangs>
        </ScrollView>
      </View>
    </View>
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

export default SettingsModal;
