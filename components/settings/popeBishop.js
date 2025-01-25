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

  const popeObject = bishopsList.POPE;
  const antiochPope = bishopsList.ANTIOCH_POPE;
  const eritreaPope = bishopsList.ERITREAN_POPE;

  const [ModalVisible, setModalVisible] = useState(false);

  function setBishopClicked() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  function setBishop(bishop) {
    dispatch(setdioceseBishop({ dioceseBishop: bishop }));
    setModalVisible(false);
  }

  const renderBishopText = (key, popeObject, languageKey) => {
    return appLanguage === "eng"
      ? `${getLanguageValue(key)} ${popeObject.English} ${
          popeObject.PopeNameNumEnglish
        }`
      : `${getLanguageValue(key)} ${popeObject.Arabic} ${
          popeObject.PopeNameNumArabic
        }`;
  };

  return (
    <>
      <BishopsPopup
        visible={ModalVisible}
        closeModal={closeModal}
        setBishop={setBishop}
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
            {renderBishopText("copticPope", popeObject, "English")}
          </Text>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {getLanguageValue("antiochPope")} {antiochPope.English}
          </Text>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {getLanguageValue("antiochPope")} {eritreaPope.English}
          </Text>
          <Text style={[styles.popeText, { color: getColor("LabelColor") }]}>
            {getLanguageValue("dioceseBishopMetropolitain")}
            {dioceseBishop?.Rank === "Bishop"
              ? ` His Grace Bishop ${dioceseBishop?.English}`
              : ` His Eminence Metropolitan ${dioceseBishop?.English}`}
          </Text>

          <Pressable onPress={setBishopClicked}>
            <View style={[styles.bookView]}>
              <Text style={[styles.english, { fontSize }]}>
                {getLanguageValue("setBishop")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <BishopPresentView />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
  },
  titleView: {
    flex: 2,
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontFamily: "english-font",
    color: "gray",
    fontStyle: "italic",
  },
  popeInfoView: {
    flexDirection: "column",
  },
  popeText: {
    fontFamily: "englishtitle-font",
    fontSize: 25,
    padding: 5,
  },
  bookView: {
    flexDirection: "row",
    backgroundColor: "#AA4A44",
    margin: 10,
  },
  english: {
    color: "black",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PopeBishop;
