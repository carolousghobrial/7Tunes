import React from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import {
  getCopticDateString,
  getCopticDate,
} from "../../helpers/copticMonthsHelper";
import PropTypes from "prop-types";
import images from "../../helpers/imageHelpers";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";

function FeastModal({ bottomSheetRef, snapPoints, feast, setFeast }) {
  const { width, height } = useWindowDimensions();
  const NavigationBarColor = getColor("NavigationBarColor");

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );
  let imageSize = width / 2.5;
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  if (width > height) {
    flexDirection = "row";
    imageStyle.height = height / 3;
    imageStyle.width = height / 3;
  } else {
    flexDirection = "column";
    imageStyle.height = width / 3;
    imageStyle.width = width / 3;
  }

  const { key, start, end } = feast;
  const copticStartDate = getCopticDate(
    start.year(),
    start.month(),
    start.date()
  );
  const copticStartDateString = getCopticDateString(
    copticStartDate.year,
    copticStartDate.month,
    copticStartDate.day
  );
  function getCopticEndDateString() {
    var copticDate = getCopticDate(end.year(), end.month(), end.date());
    return getCopticDateString(
      copticDate.year,
      copticDate.month,
      copticDate.day
    );
  }

  let labelColor = getColor("LabelColor");

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: NavigationBarColor }}
      handleIndicatorStyle={{ backgroundColor: labelColor }}
      ref={bottomSheetRef}
      handleHeight={50}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: getColor("NavigationBarColor"),
          flexDirection: flexDirection,
        }}
      >
        <View
          style={[
            styles.imageContainerLandscape,
            imageStyle,
            { borderColor: labelColor },
          ]}
        >
          <Image style={styles.image} source={images[key]} />
        </View>
        <View style={styles.textView}>
          <Text style={[styles.text, { color: labelColor }]}>
            {getLanguageValue(key)}
          </Text>
          <Text style={[styles.text, { color: labelColor }]}>
            {start.format("MMM Do YYYY")}
            {end !== null ? "-" : null}
            {end !== null ? end.format("MMM Do YYYY") : null}
          </Text>
          {/* <Text style={[styles.text, { color: labelColor }]}>
            {copticStartDateString}
            {end !== null ? "-" : null}
            {end !== null ? getCopticEndDateString() : null}
          </Text> */}
          <View style={{ flexDirection: "row" }}>
            <Pressable
              android_ripple={{ color: getColor("pageBackgroundColor") }}
              style={[styles.button, { borderColor: labelColor }]}
              onPress={() => setFeast(key)}
            >
              <Text style={[styles.text, { color: labelColor }]}>Set</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderRadius: 100 / 2,
    overflow: "hidden",
    resizeMode: "stretch",
  },
  imageContainerLandscape: {
    overflow: "hidden",
    margin: 5,
  },
  textView: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    margin: 20,
    width: "40%",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default FeastModal;
