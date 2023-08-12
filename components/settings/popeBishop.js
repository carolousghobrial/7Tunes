import {
  View,
  Switch,
  Button,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Platform,
  Pressable,
} from "react-native";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { useDispatch, useSelector } from "react-redux";
import { setdioceseBishop } from "../../stores/redux/settings";
import BishopPresentView from "../../screens/BishopPresentView";
import React, { useState, useRef, useEffect } from "react";
import BishopsPopup from "./bishopsPopup";
const bishopsList = require("../../assets/json/bishopsList.json");

function PopeBishop() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const dioceseBishop = useSelector((state) => state.settings.dioceseBishop);
  const dispatch = useDispatch();

  const popeObject = bishopsList.POPE;
  const antiochPope = bishopsList.ANTIOCH_POPE;
  const metropolitains = bishopsList.Metropolitans;
  const bishops = bishopsList.Bishops;
  let labelColor = getColor("LabelColor");

  const [ModalVisible, setModalVisible] = useState(false);

  function setBishopClicked() {
    setModalVisible(true);
  }
  function closeModal() {
    setModalVisible(false);
  }
  function setBishop(bishop) {
    // let mycurrentSeason = setCurrentSeasonByKey(timeTransition, feast);
    dispatch(setdioceseBishop({ dioceseBishop: bishop }));
    setModalVisible(false);
  }
  return (
    <>
      <BishopsPopup
        visible={ModalVisible}
        closeModal={closeModal}
        setBishop={setBishop}
      ></BishopsPopup>
      <View
        style={[styles.container, { borderColor: getColor("PrimaryColor") }]}
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
        <View
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          <View style={styles.popeView}>
            {appLanguage === "eng" ? (
              <Text style={[styles.popeText, { color: labelColor }]}>
                {getLanguageValue("copticPope")}
                {popeObject.English} {popeObject.PopeNameNumEnglish}
              </Text>
            ) : (
              <Text style={[styles.popeText, { color: labelColor }]}>
                {getLanguageValue("copticPope")}
                {popeObject.Arabic} {popeObject.PopeNameNumArabic}
              </Text>
            )}
          </View>
          <View style={styles.popeView}>
            {appLanguage === "eng" ? (
              <Text style={[styles.popeText, { color: labelColor }]}>
                {getLanguageValue("antiochPope")} {antiochPope.English}
              </Text>
            ) : (
              <Text style={[styles.popeText, { color: labelColor }]}>
                {getLanguageValue("antiochPope")} {antiochPope.Arabic}
              </Text>
            )}
          </View>
          <View style={styles.popeView}>
            {appLanguage === "eng" ? (
              <Text style={[styles.popeText, { color: labelColor }]}>
                {getLanguageValue("dioceseBishopMetropolitain")}
                {dioceseBishop?.Rank === "Bishop"
                  ? " His Grace Bishop "
                  : " His Eminence Metropolitan "}
                {dioceseBishop?.English}
              </Text>
            ) : (
              <Text style={[styles.popeText, { color: labelColor }]}>
                {getLanguageValue("dioceseBishopMetropolitain")} نيافة الحبر
                الجليل الأنبا {dioceseBishop?.Arabic}
              </Text>
            )}

            <Pressable onPress={setBishopClicked}>
              <View style={[styles.bookView]}>
                <Text style={[styles.english, { fontSize }]}>
                  {getLanguageValue("setBishop")}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <BishopPresentView></BishopPresentView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",

    borderWidth: 5,
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
  switchView: {
    flexDirection: "row",
    margin: 5,
    padding: 5,
  },
  popeView: {
    margin: 10,
    padding: 10,

    alignContent: "center",
    justifyContent: "center",
  },
  popeText: {
    fontFamily: "englishtitle-font",
    fontSize: 25,
    alignContent: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    color: "black",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default PopeBishop;
