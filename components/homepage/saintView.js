import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
} from "react-native";
import images from "../../helpers/imageHelpers";
import React, { useState, memo, useEffect } from "react";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import {
  getCopticDateString,
  getCopticDate,
} from "../../helpers/copticMonthsHelper";

function SaintView({ item, onClick }) {
  //const [copticEndDateString, setcopticEndDateString] = useState(null);
  // const copticStartDate = getCopticDate(
  //   item.start.year(),
  //   item.start.month(),
  //   item.start.date()
  // );
  // const copticStartDateString = getCopticDateString(
  //   copticStartDate.year,
  //   copticStartDate.month,
  //   copticStartDate.day
  // );

  let imageSize = 75;
  let flexDirection = "row";

  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  // function getCopticEndDateString() {
  //   var copticDate = getCopticDate(
  //     item.end.year(),
  //     item.end.month(),
  //     item.end.date()
  //   );
  //   return getCopticDateString(
  //     copticDate.year,
  //     copticDate.month,
  //     copticDate.day
  //   );
  // }

  return (
    <Pressable
      onPress={onClick.bind(this, item.titleKey)}
      style={[
        styles.secondContainer,
        {
          borderColor: "black",
        },
      ]}
    >
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
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    borderWidth: 5,
  },
  secondContainer: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    borderWidth: 5,
  },
  titleView: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "english-font",
  },
  textView: {
    flex: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontFamily: "english-font",
    color: "gray",
    fontStyle: "italic",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },
  switch: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
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
