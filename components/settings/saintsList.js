import React, { useState, useRef } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { changeTextLanguage } from "../../stores/redux/settings.js";
import SearchBar from "../ViewTypes/SearchBar";
import SaintModal from "./saintModal";
import UpdatedSaintsModal from "./UpdatedSaintsModal";
import SaintView from "../homepage/saintView.js";
import tempLang from "./tempLang"; // Use an array directly instead of a separate variable
import { changeSaint } from "../../stores/redux/saints";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  getLanguageValue,
  getFontSize,
  getColor,
  getSaint,
} from "../../helpers/SettingsHelpers.js";

function SaintsList() {
  const [currentData, setcurrentData] = useState(tempLang);
  const snapPoints = ["75%"];
  const bottomSheetRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedSaint, setSelectedSaint] = useState("");
  const [newselectedSaint, newsetSelectedSaint] = useState(null);
  const [saintModalVisible, setsaintModalVisible] = useState(false);
  const dispatch = useDispatch();

  const imageSize = 50;
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };

  function onSwitch(item, e) {
    dispatch(
      changeTextLanguage({ lang: item.titleKey, value: !item.titleKey })
    );
  }

  function openModal(item) {
    try {
      newsetSelectedSaint(item);
      bottomSheetRef.current?.present();
      // setSelectedSaint(item);
      // setsaintModalVisible(true);
    } catch (e) {
      Alert.alert(e);
    }
  }

  function closeModal() {
    setsaintModalVisible(false);
  }

  function handleSearch(text) {
    setSearchPhrase(text);
    const filteredData = tempLang.filter(
      (item) =>
        item.titleKey.toLowerCase()?.includes(text.toLowerCase()) ||
        item.titleKey?.includes(text)
    );
    setcurrentData(filteredData);
  }

  function updateSaint(saint, saintObject) {
    dispatch(changeSaint({ saint: saint, object: saintObject }));
    bottomSheetRef.current?.dismiss();
  }

  function renderItems({ item }) {
    return <SaintView item={item} onClick={openModal} />;
  }

  return (
    <BottomSheetModalProvider>
      <UpdatedSaintsModal
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        updateSaint={updateSaint}
        saint={newselectedSaint}
      />
      <View style={styles.container}>
        <SearchBar
          setClicked={setClicked}
          searchPhrase={searchPhrase}
          handleSearch={handleSearch}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
        />
        <FlatList
          data={currentData}
          horizontal={false}
          initialNumToRender={tempLang.length}
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItems}
          keyExtractor={(item) => item.titleKey} // Use titleKey as the key
        />
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 5,
  },
  secondContainer: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",
  },
  titleView: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "english-font",
  },
  textView: {
    flex: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
    padding: 5,
    fontFamily: "english-font",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontFamily: "english-font",
    color: "gray",
    fontStyle: "italic",
  },
  imageContainerLandscape: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 5,
  },
  switch: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 90,
    borderRadius: 100 / 2,
    overflow: "hidden",
  },
});

export default SaintsList;
