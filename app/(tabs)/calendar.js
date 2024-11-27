import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef, useMemo } from "react";
import moment from "moment";
import { useRouter } from "expo-router";
import {
  setCurrentSeasonLive,
  getCopticFastsFeasts,
} from "../../helpers/copticMonthsHelper";
import FeastView from "../../components/homepage/feastView";
import SelectYearModal from "../../components/homepage/SelectYearModal";
import SearchBar from "../../components/ViewTypes/SearchBar";
import FeastScreenTitleView from "../../components/homepage/FeastScreenTitleView";
import Languages from "../../constants/languages";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";

function FullFeastsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pageBackgroundColor = getColor("pageBackgroundColor");

  const fontSize = useSelector((state) => state.settings.textFontSize);
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [time, setTime] = useState(new Date(timeTransition));
  const flatListRef = useRef();

  const snapPoints = ["55%"];
  const currentYear = useMemo(() => moment().year(), []);
  const data = getCopticFastsFeasts(currentYear).sort(
    (a, b) =>
      new moment(a.start).format("YYYYMMDD") -
      new moment(b.start).format("YYYYMMDD")
  );

  const [currentData, setCurrentData] = useState(data);

  const handleSearch = (text) => {
    setSearchPhrase(text);
    const filteredData = data.filter(
      (item) =>
        Languages["eng"][item.key]
          ?.toLowerCase()
          .includes(text.toLowerCase()) ||
        Languages["ara"][item.key]?.includes(text)
    );
    setCurrentData(filteredData);
  };

  const renderItems = ({ item }) => (
    <FeastView
      item={item}
      onClick={() =>
        router.push({
          pathname: "/(modal)/feastModal",
          params: { feast: JSON.stringify(item) },
        })
      }
    />
  );

  const onScrollToIndexFailed = (error) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: error.index,
        animated: true,
      });
    }, 100);
  };

  const setYear = (year) => {
    const newData = getCopticFastsFeasts(year).sort(
      (a, b) =>
        new moment(a.start).format("YYYYMMDD") -
        new moment(b.start).format("YYYYMMDD")
    );
    setCurrentData(newData);
    setYearModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: pageBackgroundColor }]}
    >
      <ImageBackground
        source={require("../../assets/images/copticBackground.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <SelectYearModal
          visible={yearModalVisible}
          closeModal={() => setYearModalVisible(false)}
          setYear={setYear}
        />
        <View style={styles.container}>
          <FeastScreenTitleView
            yearClick={() => setYearModalVisible(true)}
            changeDate={() => Alert.alert("CHANGEDATE")}
          />
          <SearchBar
            setClicked={setClicked}
            searchPhrase={searchPhrase}
            handleSearch={handleSearch}
            setSearchPhrase={setSearchPhrase}
            clicked={clicked}
          />
          <FlatList
            data={currentData}
            ref={flatListRef}
            horizontal={false}
            renderItem={renderItems}
            keyExtractor={(item) => item.key}
            onScrollToIndexFailed={onScrollToIndexFailed}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default FullFeastsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  list: {
    width: "100%",
  },
});
