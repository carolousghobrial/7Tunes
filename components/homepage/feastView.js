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

function FeastView({ item, onClick }) {
  //const [copticEndDateString, setcopticEndDateString] = useState(null);
  const copticStartDate = getCopticDate(
    item.start.year(),
    item.start.month(),
    item.start.date()
  );
  const copticStartDateString = getCopticDateString(
    copticStartDate.year,
    copticStartDate.month,
    copticStartDate.day
  );

  let imageSize = 75;
  let flexDirection = "row";

  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  function getCopticEndDateString() {
    var copticDate = getCopticDate(
      item.end.year(),
      item.end.month(),
      item.end.date()
    );
    return getCopticDateString(
      copticDate.year,
      copticDate.month,
      copticDate.day
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getColor("NavigationBarColor") },
      ]}
    >
      <Pressable
        style={[styles.bookViewLandscape, { flexDirection: flexDirection }]}
        android_ripple={{ color: "#AA4A44" }}
        onPress={onClick.bind(this, item)}
      >
        <View style={[styles.imageContainerLandscape, imageStyle]}>
          <Image style={styles.image} source={images[item.key]} />
        </View>

        <View style={styles.textViewLanscape}>
          <Text
            style={[
              styles.text,
              { color: getColor("LabelColor"), fontSize: 24 },
            ]}
          >
            {getLanguageValue(item.key)}
          </Text>
          <Text style={[styles.text, { color: getColor("LabelColor") }]}>
            {item.start.format("dddd, MMMM D, YYYY")}
            {item.end !== null ? "-" : null}
            {item.end !== null ? item.end.format("dddd, MMMM D, YYYY") : null}
          </Text>
          <Text style={[styles.text, { color: getColor("LabelColor") }]}>
            {copticStartDateString}
            {item.end !== null ? "-" : null}
            {item.end !== null ? getCopticEndDateString() : null}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderRadius: 30,
    opacity: 0.8,
    margin: 5,
    padding: 5,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 90,
    borderRadius: 100 / 2,
    overflow: "hidden",
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
    fontWeight: "bold",
    textAlign: "center",
  },
  bookViewLandscape: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  imageContainerLandscape: {
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },
  textViewLanscape: {
    flex: 2,
    borderColor: "black",
    justifyContent: "flex-start",
  },
});

export default FeastView;
