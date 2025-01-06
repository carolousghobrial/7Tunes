import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Image,
  Alert,
  useWindowDimensions,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  getLanguageValue,
  getColor,
  getSaint,
} from "../../helpers/SettingsHelpers.js";
import images from "../../helpers/imageHelpers";

const SaintModal = React.memo(({ visible, saint, closeModal, updateSaint }) => {
  const saintSelected = getSaint(saint);
  const { width, height } = useWindowDimensions();
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const [checkedOptions, setCheckedOptions] = useState({
    versesofCymbals: saintSelected?.versesofCymbals || false,
    doxologies: saintSelected?.doxologies || false,
  });

  // Dynamically calculate image size based on orientation
  const imageSize = width / 3;
  const imageStyle = {
    width: imageSize,
    height: imageSize,
  };

  useEffect(() => {
    if (visible) {
      setCheckedOptions({
        versesofCymbals: saintSelected.versesofCymbals,
        doxologies: saintSelected.doxologies,
      });
    }
  }, [visible, saintSelected]);

  const handleCloseModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleSetSaint = useCallback(() => {
    saintSelected.versesofCymbals = checkedOptions.versesofCymbals;
    saintSelected.doxologies = checkedOptions.doxologies;
    updateSaint(saint, saintSelected);
  }, [checkedOptions, saint, saintSelected, updateSaint]);

  const handleCheckboxChange = (key) => (value) => {
    setCheckedOptions((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={handleCloseModal}
      supportedOrientations={["portrait", "landscape"]}
    >
      <Pressable onPress={handleCloseModal} style={styles.container}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.modalContent,
              { height: height * 0.5, width: "100%" },
            ]}
          >
            <View style={[styles.imageContainer, imageStyle]}>
              <Image style={styles.image} source={images[saint]} />
            </View>
            <Text
              style={[
                styles.text,
                { fontSize: fontSize * 1.5, color: getColor("PrimaryColor") },
              ]}
            >
              {getLanguageValue(saint)}
            </Text>
            <View style={styles.checkboxContainer}>
              <CheckboxOption
                label="Verses of Cymbals"
                checked={checkedOptions.versesofCymbals}
                onChange={handleCheckboxChange("versesofCymbals")}
              />
              <CheckboxOption
                label="Doxologies"
                checked={checkedOptions.doxologies}
                onChange={handleCheckboxChange("doxologies")}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <Pressable
                android_ripple={{ color: getColor("pageBackgroundColor") }}
                style={styles.button}
                onPress={handleCloseModal}
              >
                <Text
                  style={[styles.text, { color: getColor("PrimaryColor") }]}
                >
                  Close
                </Text>
              </Pressable>
              <Pressable
                android_ripple={{ color: getColor("pageBackgroundColor") }}
                style={styles.button}
                onPress={handleSetSaint}
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
});

const CheckboxOption = React.memo(({ label, checked, onChange }) => (
  <View style={styles.section}>
    <Checkbox
      style={styles.checkbox}
      value={checked}
      onValueChange={onChange}
    />
    <Text style={[styles.checkboxLabel, { fontSize: 18 }]}>{label}</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: getColor("NavigationBarColor"),
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    margin: 5,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  text: {
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "column",
    marginVertical: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontFamily: "english-font",
    color: getColor("PrimaryColor"),
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: getColor("SecondaryColor"),
  },
});

export default SaintModal;
