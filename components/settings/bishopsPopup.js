import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  SectionList,
  SafeAreaView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import SearchBar from "../ViewTypes/SearchBar";

const bishopsList = require("../../assets/json/bishopsList.json");

function BishopsPopup({ visible, closeModal, setBishop }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  // Theme colors
  const labelColor = getColor("LabelColor");
  const itemBackgroundColor = getColor("pageBackgroundColor");
  const pageBackgroundColor = getColor("NavigationBarColor");

  // Get screen dimensions for responsive layout
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  // Process and sort bishop data
  const DATA = useMemo(
    () =>
      [
        { title: "Metropolitans", data: bishopsList.Metropolitans },
        { title: "Diocese Bishops", data: bishopsList.Diocese_Bishops },
        { title: "Monastery Bishops", data: bishopsList.Monastery_Bishops },
      ].map((section) => ({
        ...section,
        data: section.data.sort((a, b) => a.English.localeCompare(b.English)),
      })),
    []
  );

  // Search function with memoization
  const filteredData = useMemo(() => {
    if (!searchPhrase) return DATA;
    return DATA.reduce((result, section) => {
      const filteredItems = section.data.filter(
        (item) =>
          item.English.toLowerCase().includes(searchPhrase.toLowerCase()) ||
          item.Arabic.includes(searchPhrase) ||
          item.dioceseEnglish
            .toLowerCase()
            .includes(searchPhrase.toLowerCase()) ||
          item.dioceseArabic.includes(searchPhrase)
      );
      if (filteredItems.length)
        result.push({ title: section.title, data: filteredItems });
      return result;
    }, []);
  }, [searchPhrase, DATA]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={closeModal}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: pageBackgroundColor }]}
      >
        <SearchBar
          setClicked={setClicked}
          searchPhrase={searchPhrase}
          handleSearch={setSearchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
        />

        <SectionList
          sections={filteredData}
          keyExtractor={(item, index) => `${item.English}-${index}`}
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
            <Text style={[styles.header, { color: labelColor }]}>{title}</Text>
          )}
          style={styles.list}
        />

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { borderColor: labelColor }]}
            onPress={closeModal}
          >
            <Text style={[styles.buttonText, { color: labelColor }]}>
              Close
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  list: {
    width: "100%",
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BishopsPopup;
