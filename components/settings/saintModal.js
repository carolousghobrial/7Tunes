import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  Switch,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Image,
  useWindowDimensions,
} from "react-native";
import Colors from "../../constants/colors.js";

import Checkbox from "expo-checkbox";
import AppTheme from "../settings/appTheme";
import FontSize from "../settings/fontSize";
import VisibleLangs from "../settings/visibleLangs";
import TodaysPrayer from "../settings/todaysPrayer";
import images from "../../helpers/imageHelpers";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageValue,
  getFontSize,
  getColor,
  getSaint,
} from "../../helpers/SettingsHelpers.js";

function SaintModal({ visible, saint, closeModal, updateSaint }) {
  const saintSelected = getSaint(saint);

  const { width, height } = useWindowDimensions();
  const [vosChecked, setvosChecked] = useState(false);
  const [doxChecked, setdoxChecked] = useState(false);
  const fontSize = useSelector((state) => state.settings.textFontSize);

  let viewheight = "50%";
  let viewwidth = "100%";
  let imageSize = width / 3;
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  if (width > height) {
    flexDirection = "row";
    viewheight = "100%";
    viewwidth = "50%";
  }
  useEffect(() => {
    if (visible) {
      // Do something when the modal appears...
      setvosChecked(saintSelected.vos);
      setdoxChecked(saintSelected.doxologies);
    }
  }, [visible]);

  function toggleSwitchDox(value) {
    saintSelected.doxologies = value;
    setdoxChecked(value);
  }
  function toggleSwitchVOS(value) {
    saintSelected.vos = value;
    setvosChecked(value);
  }
  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={closeModal}
      supportedOrientations={[
        "portrait",
        "portrait-upside-down",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
    >
      <Pressable onPress={closeModal} style={[styles.container]}>
        <TouchableWithoutFeedback>
          <View
            style={{
              height: viewheight,
              width: viewwidth,
              alignItems: "center",
              backgroundColor: getColor("NavigationBarColor"),
            }}
          >
            <View style={[styles.imageContainerLandscape, imageStyle]}>
              <Image style={styles.image} source={images[saint]} />
            </View>
            <Text style={[styles.text, { color: getColor("PrimaryColor") }]}>
              {getLanguageValue(saint)}
            </Text>
            <View style={styles.checkboxcontainer}>
              <View style={styles.section}>
                <View style={styles.switch}>
                  <View style={styles.textContainer}>
                    <Text
                      style={vosChecked ? [styles.textOn] : [styles.textOff]}
                    >
                      {vosChecked ? "YES" : "NO"}
                    </Text>
                  </View>
                  <Switch
                    ios_backgroundColor={
                      vosChecked ? Colors.NavigationBarColor : "red"
                    }
                    value={vosChecked}
                    onValueChange={(value) => toggleSwitchVOS(value)}
                    thumbColor="white"
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSize,
                    fontFamily: "english-font",
                    color: getColor("PrimaryColor"),
                  }}
                >
                  Verses of Cymbals
                </Text>
              </View>
              <View style={styles.section}>
                <View style={styles.switch}>
                  <View style={styles.textContainer}>
                    <Text
                      style={doxChecked ? [styles.textOn] : [styles.textOff]}
                    >
                      {doxChecked ? "YES" : "NO"}
                    </Text>
                  </View>
                  <Switch
                    ios_backgroundColor={
                      doxChecked ? Colors.NavigationBarColor : "red"
                    }
                    value={doxChecked}
                    onValueChange={(value) => toggleSwitchDox(value)}
                    thumbColor="white"
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSize,
                    fontFamily: "english-font",
                    color: getColor("PrimaryColor"),
                  }}
                >
                  Doxologies
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Pressable
                android_ripple={{ color: getColor("pageBackgroundColor") }}
                style={[
                  styles.button,
                  { borderColor: getColor("PrimaryColor") },
                ]}
                onPress={closeModal}
              >
                <Text
                  style={[styles.text, { color: getColor("PrimaryColor") }]}
                >
                  Close
                </Text>
              </Pressable>
              <Pressable
                android_ripple={{ color: getColor("pageBackgroundColor") }}
                style={[
                  styles.button,
                  { borderColor: getColor("PrimaryColor") },
                ]}
                onPress={updateSaint.bind(this, saint, saintSelected)}
              >
                <Text
                  style={[styles.text, { color: getColor("PrimaryColor") }]}
                >
                  Set
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  checkboxcontainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    margin: 8,
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderRadius: 100 / 2,
    overflow: "hidden",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    margin: 5,
  },
  text: {
    color: "black",
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 5,
  },
});

export default SaintModal;
