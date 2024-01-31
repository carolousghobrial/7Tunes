import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import images from "../../helpers/imageHelpers";
import { getLanguageValue } from "../../helpers/SettingsHelpers";
import {
  getCopticDateString,
  getDateByCopticDate,
} from "../../helpers/copticMonthsHelper";
import { useSelector, useDispatch } from "react-redux";

const imageSize = 75;
const flexDirection = "row";
const saintsFeastsCalendar = require("../../assets/json/saintsFeastsCalendar.json");

const SaintView = ({ item, onClick }) => {
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const containerStyle = {
    margin: 5,
    padding: 5,
    flexDirection,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
  };
  const gregDate = getDateByCopticDate(
    currentSeason.copticMonth,
    currentSeason.copticDay
  );
  return (
    <Pressable onPress={() => onClick(item.titleKey)} style={containerStyle}>
      <View style={[styles.imageContainerLandscape, imageStyle]}>
        <Image style={styles.image} source={images[item.titleKey]} />
      </View>
      <View style={styles.textview}>
        <Text style={styles.title}>{getLanguageValue(item.titleKey)}</Text>

        {saintsFeastsCalendar[item.titleKey].map((date, index) => (
          <View key={index} style={styles.DateBox}>
            <Text style={styles.text}>
              {getCopticDateString(
                currentSeason.copticYear,
                date.month,
                date.day
              )}
            </Text>
            <Text> | </Text>
            <Text style={styles.text}>
              {date.month !== undefined
                ? getDateByCopticDate(date.month, date.day)
                : null}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textview: {
    flex: 2,
  },
  DateBox: {
    flexDirection: "row",
  },
  text: {
    color: "black",
    fontSize: 15,
    padding: 5,
    flex: 5,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    color: "black",
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainerLandscape: {
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
    resizeMode: "stretch",
    overflow: "hidden",
  },
});

export default SaintView;
