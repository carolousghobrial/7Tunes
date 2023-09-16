import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Alert,
} from "react-native";
import {
  getCopticDateString,
  getCopticDate,
} from "../../helpers/copticMonthsHelper";
import PropTypes from "prop-types";
import images from "../../helpers/imageHelpers";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";

import {
  getLanguageValue,
  getFontSize,
  getColor,
  getSaint,
} from "../../helpers/SettingsHelpers.js";
import { Switch } from "react-native-gesture-handler";
function UpdatedSaintsModal({
  bottomSheetRef,
  snapPoints,
  saint,
  updateSaint,
}) {
  const { width, height } = useWindowDimensions();
  const NavigationBarColor = getColor("NavigationBarColor");
  //const saintSelected = getSaint(saint);
  const labelColor = getColor("LabelColor");

  const saints = useSelector((state) => state.saints);
  const [saintSelected, setSaintSelected] = useState(saints.ST_MARINA);

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
  useEffect(() => {
    try {
      if (saint != null) {
        setSaintSelected(saints[saint]);
        Alert.alert(saints[saint]);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [saint]);
  function toggleSwitch(key, e) {
    console.log(key);
    console.log(e);
    setSaintSelected((prev) => ({
      ...prev, // Spread the previous state
      [key]: e, // Update the age property
    }));
  }

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
      <View style={[styles.container, { flexDirection: flexDirection }]}>
        <View style={[styles.imageContainerLandscape, imageStyle]}>
          <Image style={styles.image} source={images[saint]} />
          <Text style={[styles.text, { color: labelColor }]}>
            {getLanguageValue(saint)}
          </Text>
        </View>

        <View style={{ flex: 6 }}>
          {Object.keys(saintSelected)?.map((key) => (
            <View key={key} style={styles.inputStyle}>
              <Text style={[styles.text, { flex: 7, color: labelColor }]}>
                {getLanguageValue(key)}
              </Text>
              <Switch
                style={{ flex: 3 }}
                value={saintSelected[key]}
                onValueChange={(e) => toggleSwitch(key, e)}
              ></Switch>
            </View>
          ))}
        </View>

        <Pressable
          android_ripple={{ color: getColor("pageBackgroundColor") }}
          style={[styles.button, { borderColor: labelColor }]}
          onPress={updateSaint.bind(this, saint, saintSelected)}
        >
          <Text style={[styles.buttonText]}>Set</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  inputStyle: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignContent: "center",
    margin: 5,
    flex: 3,
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
    flex: 1,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",

    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UpdatedSaintsModal;
