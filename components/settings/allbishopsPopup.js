import {
  View,
  Switch,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Platform,
  Pressable,
  Modal,
  SectionList,
  SafeAreaView,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../ViewTypes/SearchBar";

const bishopsList = require("../../assets/json/bishopsList.json");

function AllBishopsPopup({ visible, closeModal, setBishop }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  const labelColor = getColor("LabelColor");
  const itemBackgroundColor = getColor("pageBackgroundColor");
  const pageBackgroundColor = getColor("NavigationBarColor");
  const [clicked, setClicked] = useState(false);
  const { width, height } = useWindowDimensions();
  let viewheight = "70%";
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
  const [searchPhrase, setSearchPhrase] = useState("");

  const popeObject = bishopsList.POPE;
  const antiochPope = bishopsList.ANTIOCH_POPE;
  const metropolitans = bishopsList.Metropolitans;
  const dioceseBishops = bishopsList.Diocese_Bishops;
  const monasteryBishops = bishopsList.Monastery_Bishops;
  const generalBishops = bishopsList.General_Bishops;

  const bishopSections = [
    {
      title: "Metropolitans",
      data: metropolitans.sort((a, b) => a.English.localeCompare(b.English)),
    },
    {
      title: "Diocese Bishops",
      data: dioceseBishops.sort((a, b) => a.English.localeCompare(b.English)),
    },
    {
      title: "Monastery Bishops",
      data: monasteryBishops.sort((a, b) => a.English.localeCompare(b.English)),
    },
    {
      title: "General Bishops",
      data: generalBishops.sort((a, b) => a.English.localeCompare(b.English)),
    },
  ];
  const [currentBishopSections, setCurrentBishopSections] =
    useState(bishopSections);

  const handleSearch = (text) => {
    setSearchPhrase(text);

    const filteredSections = bishopSections.reduce((result, section) => {
      const { title, data } = section;
      const filteredData = data.filter(
        (item) =>
          item.English.toLowerCase()?.includes(text.toLowerCase()) ||
          item.Arabic?.includes(text) ||
          item.dioceseEnglish.toLowerCase()?.includes(text.toLowerCase()) ||
          item.dioceseArabic?.includes(text)
      );

      if (filteredData.length !== 0) {
        result.push({
          title,
          data: filteredData,
        });
      }

      return result;
    }, []);

    setCurrentBishopSections(filteredSections);
  };

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
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: pageBackgroundColor,
          },
        ]}
      >
        <SearchBar
          setClicked={setClicked}
          searchPhrase={searchPhrase}
          handleSearch={handleSearch}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
        />
        <SectionList
          sections={currentBishopSections}
          style={{ width: "100%" }}
          keyExtractor={(item, index) => item.key}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.item, { backgroundColor: itemBackgroundColor }]}
              onPress={setBishop.bind(this, item)}
            >
              <Text style={[styles.title, { color: labelColor }]}>
                {appLanguage === "eng"
                  ? `Abba ${item.English}`
                  : `الانبا ${item.Arabic}`}
              </Text>
              <Text style={[styles.subtitle, { color: labelColor }]}>
                {appLanguage === "eng"
                  ? item.dioceseEnglish
                  : item.dioceseArabic}
              </Text>
            </Pressable>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />

        <View style={{ flexDirection: "row" }}>
          <Pressable
            android_ripple={{ color: getColor("pageBackgroundColor") }}
            style={[styles.button, { borderColor: labelColor }]}
            onPress={closeModal}
          >
            <Text style={[styles.text, { color: labelColor }]}>Close</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "grey",
    borderColor: "black",
    borderWidth: 5,
    marginVertical: 8,
  },
  header: {
    fontSize: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
  },
  text: {
    color: "black",
    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
  },
});

export default AllBishopsPopup;
