import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import images from "../../helpers/imageHelpers";
import { getLanguageValue } from "../../helpers/SettingsHelpers";

const imageSize = 75;
const flexDirection = "row";

const SaintView = ({ item, onClick }) => {
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  const containerStyle = {
    margin: 5,
    padding: 5,
    flexDirection,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    borderWidth: 5,
    borderColor: "black",
  };

  return (
    <Pressable onPress={() => onClick(item.titleKey)} style={containerStyle}>
      <View style={[styles.imageContainerLandscape, imageStyle]}>
        <Image style={styles.image} source={images[item.titleKey]} />
      </View>
      <View style={styles.textview}>
        <Text style={[styles.text, { color: "black" }]}>
          {getLanguageValue(item.titleKey)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textview: {
    flex: 2,
  },
  text: {
    color: "black",
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 90,
    borderRadius: 100 / 2,
    overflow: "hidden",
  },
});

export default SaintView;
