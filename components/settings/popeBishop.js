import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { setdioceseBishop } from "../../stores/redux/settings";
import BishopsPopup from "./bishopsPopup";
import BishopPresentView from "../../app/(modal)/BishopPresentView";

const bishopsList = require("../../assets/json/bishopsList.json");

function PopeBishop() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);

  const popeObject = bishopsList.POPE;
  const antiochPope = bishopsList.ANTIOCH_POPE;
  const eritreaPope = bishopsList.ERITREAN_POPE;

  const handleSetBishop = (bishop) => {
    dispatch(setdioceseBishop({ dioceseBishop: bishop }));
    setModalVisible(false);
  };

  const renderBishopText = (key, popeData) =>
    appLanguage === "eng"
      ? `${getLanguageValue(key)} ${popeData.English} ${
          popeData.PopeNameNumEnglish
        }`
      : `${getLanguageValue(key)} ${popeData.Arabic} ${
          popeData.PopeNameNumArabic
        }`;

  return (
    <>
      <BishopsPopup
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
        setBishop={handleSetBishop}
      />

      <View
        style={[
          styles.container,
          {
            borderColor: getColor("PrimaryColor"),
            backgroundColor: getColor("NavigationBarColor"),
          },
        ]}
      >
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("popeSelect")}
          </Text>
          <Text
            style={[styles.description, { color: getColor("PrimaryColor") }]}
          >
            {getLanguageValue("popeSelectDescription")}
          </Text>
        </View>

        <View style={styles.popeInfoView}>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {renderBishopText("copticPope", popeObject)}
          </Text>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {getLanguageValue("antiochPope")} {antiochPope.English}
          </Text>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {getLanguageValue("antiochPope")} {eritreaPope.English}
          </Text>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {getLanguageValue("dioceseBishopMetropolitain")}{" "}
            {dioceseBishop?.Rank === "Bishop"
              ? `His Grace Bishop ${dioceseBishop?.English}`
              : `His Eminence Metropolitan ${dioceseBishop?.English}`}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.buttonText, { fontSize }]}>
              {getLanguageValue("setBishop")}
            </Text>
          </Pressable>
        </View>
      </View>

      <BishopPresentView />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  titleView: {
    marginBottom: 10,
  },
  title: {
    fontFamily: "english-font",
    fontWeight: "bold",
  },
  description: {
    fontFamily: "english-font",
    color: "gray",
    fontStyle: "italic",
  },
  popeInfoView: {
    marginTop: 10,
  },
  popeText: {
    fontFamily: "englishtitle-font",
    fontSize: 22,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: "#AA4A44",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "english-font",
    fontWeight: "bold",
  },
});

export default PopeBishop;
