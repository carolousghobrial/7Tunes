import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useRouter } from "expo-router";

import { getCopticFastsFeasts } from "../../helpers/copticMonthsHelper";
import FeastView from "../../components/homepage/feastView";
import SelectYearModal from "../../components/homepage/SelectYearModal";
import SearchBar from "../../components/ViewTypes/SearchBar";
import FeastScreenTitleView from "../../components/homepage/FeastScreenTitleView";
import { getColor } from "../../helpers/SettingsHelpers";
import Languages from "../../constants/languages";

function FullFeastsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const flatListRef = useRef();

  const pageBackgroundColor = getColor("pageBackgroundColor");
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [yearModalVisible, setYearModalVisible] = useState(false);

  const currentYear = useMemo(() => moment().year(), []);
  const allFeasts = useMemo(
    () =>
      getCopticFastsFeasts(currentYear).sort(
        (a, b) =>
          moment(a.start).format("YYYYMMDD") -
          moment(b.start).format("YYYYMMDD")
      ),
    [currentYear]
  );

  const [currentData, setCurrentData] = useState(allFeasts);

  const handleSearch = useCallback(
    (text) => {
      setSearchPhrase(text);
      const filteredData = allFeasts.filter(
        (item) =>
          Languages["eng"][item.key]
            ?.toLowerCase()
            .includes(text.toLowerCase()) ||
          Languages["ara"][item.key]?.includes(text)
      );
      setCurrentData(filteredData);
    },
    [allFeasts]
  );

  const handleYearChange = useCallback((year) => {
    const newData = getCopticFastsFeasts(year).sort(
      (a, b) =>
        moment(a.start).format("YYYYMMDD") - moment(b.start).format("YYYYMMDD")
    );
    setCurrentData(newData);
    setYearModalVisible(false);
  }, []);

  const renderItems = useCallback(
    ({ item }) => (
      <FeastView
        item={item}
        onClick={() =>
          router.push({
            pathname: "/(modal)/feastModal",
            params: { feast: JSON.stringify(item) },
          })
        }
      />
    ),
    [router]
  );

  const onScrollToIndexFailed = useCallback((error) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: error.index,
        animated: true,
      });
    }, 100);
  }, []);

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
          setYear={handleYearChange}
        />
        <View style={styles.container}>
          <FeastScreenTitleView
            yearClick={() => setYearModalVisible(true)}
            changeDate={() => Alert.alert("Change Date")}
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
  backgroundImage: {
    flex: 1,
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
