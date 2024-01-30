import React, { useState } from "react";
import {
  Modal,
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import moment from "moment";

import { getColor } from "../../helpers/SettingsHelpers.js";

function SelectYearModal({ visible, closeModal, setYear }) {
  const labelColor = getColor("LabelColor");
  const years = Array.from(Array(20), (_, i) => moment().year() + i);

  const [selectedYear, setSelectedYear] = useState(years[0]); // initialize the selected year to the first year in the array
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
            <FlatList
              data={years}
              horizontal={false}
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setYear(item)}
                  style={{
                    borderColor: labelColor,
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.2)", // semi-transparent background

                    margin: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      padding: 5,
                      color: labelColor,
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.toString()}
            />
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

export default SelectYearModal;
