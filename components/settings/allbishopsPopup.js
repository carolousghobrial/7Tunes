import {
  View,
  StyleSheet,
  Text,
  Modal,
  SectionList,
  SafeAreaView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useMemo } from "react";
import SearchBar from "../ViewTypes/SearchBar";
import { getColor } from "../../helpers/SettingsHelpers";

const bishopsList = require("../../assets/json/bishopsList.json");

function AllBishopsPopup({ visible, closeModal, setBishop }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const { width, height } = useWindowDimensions();

  // Dynamically adjusting layout based on orientation
  const isLandscape = width > height;
  const imageSize = width / 2.5;
  const viewStyle = isLandscape
    ? { flexDirection: "row", height: "100%", width: "50%" }
    : { height: "70%", width: "100%" };
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  const labelColor = getColor("LabelColor");
  const itemBackgroundColor = getColor("pageBackgroundColor");
  const pageBackgroundColor = getColor("NavigationBarColor");

  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

  const bishopSections = useMemo(() => {
    const sortBishops = (bishops) =>
      bishops.sort((a, b) => a.English.localeCompare(b.English));
    return [
      { title: "Metropolitans", data: sortBishops(bishopsList.Metropolitans) },
      {
        title: "Diocese Bishops",
        data: sortBishops(bishopsList.Diocese_Bishops),
      },
      {
        title: "Monastery Bishops",
        data: sortBishops(bishopsList.Monastery_Bishops),
      },
      {
        title: "General Bishops",
        data: sortBishops(bishopsList.General_Bishops),
      },
    ];
  }, []);

  const currentBishopSections = useMemo(() => {
    return bishopSections.filter((section) =>
      section.data.some(
        (item) =>
          item.English.toLowerCase().includes(searchPhrase.toLowerCase()) ||
          item.Arabic.includes(searchPhrase) ||
          item.dioceseEnglish
            .toLowerCase()
            .includes(searchPhrase.toLowerCase()) ||
          item.dioceseArabic.includes(searchPhrase)
      )
    );
  }, [searchPhrase, bishopSections]);

  const handleSearch = (text) => setSearchPhrase(text);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={closeModal}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: pageBackgroundColor }]}
      >
        <SearchBar
          setClicked={setClicked}
          searchPhrase={searchPhrase}
          handleSearch={handleSearch}
          clicked={clicked}
        />
        <SectionList
          sections={currentBishopSections}
          style={styles.sectionList}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.item, { backgroundColor: itemBackgroundColor }]}
              onPress={() => setBishop(item)}
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
        <View style={styles.buttonContainer}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  sectionList: {
    width: "100%",
  },
  item: {
    marginVertical: 8,
    borderColor: "black",
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
    fontSize: 20,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 5,
    borderWidth: 1,
  },
});

export default AllBishopsPopup;
