import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function OnboardingItem({ item }) {
  const { width, height } = useWindowDimensions();
  const isTablet = useSelector((state) => state.settings.isTablet);
  const fontSize = isTablet ? 30 : 20;
  let imageSize = 300;
  let myWidth = width;

  if (width > height) {
    // Landscape mode
    myWidth = width * 0.9;
  }

  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };
  const bookviewStyle = {
    width: width / 2.5,
    height: height / 3.5,
    alignItems: "center",
    justifyContent: "center",
  };
  return <View style={{ width: myWidth }}>{item.content}</View>;
}

export default OnboardingItem;

const styles = StyleSheet.create({
  image: {
    flex: 0.8,
    justifyContent: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 10,
    color: "#493d8a",
    textAlign: "center",
  },
  desciption: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    paddingHorizontal: 64,
  },
});
