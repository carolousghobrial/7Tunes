import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useDispatch } from "react-redux";
import { changeTextLanguage } from "../../stores/redux/settings";
import SearchBar from "../../components/ViewTypes/SearchBar";
import SaintView from "../../components/homepage/saintView";
import tempLang from "../../components/settings/tempLang";
import { useRouter } from "expo-router";
import { getColor } from "../../helpers/SettingsHelpers";

function SaintsList() {
  const [currentData, setCurrentData] = useState(tempLang);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const pageBackgroundColor = getColor("pageBackgroundColor");

  const handleSearch = (text) => {
    setSearchPhrase(text);
    const filteredData = tempLang.filter((item) =>
      item.titleKey.toLowerCase().includes(text.toLowerCase())
    );
    setCurrentData(filteredData);
  };

  const handleSaintClick = (item) => {
    router.push({
      pathname: "/(modal)/saintsModal",
      params: { saint: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }) => (
    <SaintView item={item} onClick={() => handleSaintClick(item)} />
  );

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: pageBackgroundColor }]}
    >
      <ImageBackground
        source={require("../../assets/images/copticBackground.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
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
            keyExtractor={(item) => item.titleKey}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SaintsList;
