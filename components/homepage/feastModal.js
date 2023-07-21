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
import PropTypes from "prop-types";
import images from "../../helpers/imageHelpers";

import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";

function FeastModal({ visible, feast, closeModal, setFeast }) {
  const { width, height } = useWindowDimensions();
  let viewheight = "50%";
  let viewwidth = "100%";
  let imageSize = width / 2.5;
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

  const { key, start, end } = feast;
  let labelColor = getColor("LabelColor");

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
      <Pressable onPress={closeModal} style={styles.container}>
        <TouchableWithoutFeedback>
          <View
            style={{
              height: viewheight,
              width: viewwidth,
              alignItems: "center",
              backgroundColor: getColor("NavigationBarColor"),
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
            <Text style={[styles.text, { color: labelColor }]}>
              {getLanguageValue(key)}
            </Text>
            <Text style={[styles.text, { color: labelColor }]}>
              {start.format("MMM Do YYYY")}
              {end !== null ? "-" : null}
              {end !== null ? end.format("MMM Do YYYY") : null}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                android_ripple={{ color: getColor("pageBackgroundColor") }}
                style={[styles.button, { borderColor: labelColor }]}
                onPress={closeModal}
              >
                <Text style={[styles.text, { color: labelColor }]}>Close</Text>
              </Pressable>
              <Pressable
                android_ripple={{ color: getColor("pageBackgroundColor") }}
                style={[styles.button, { borderColor: labelColor }]}
                onPress={() => setFeast(key)}
              >
                <Text style={[styles.text, { color: labelColor }]}>Set</Text>
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
    borderColor: "black",
    borderWidth: 5,
  },
});

FeastModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  feast: PropTypes.shape({
    key: PropTypes.string.isRequired,
    start: PropTypes.object.isRequired,
    end: PropTypes.object,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  setFeast: PropTypes.func.isRequired,
};

export default FeastModal;
