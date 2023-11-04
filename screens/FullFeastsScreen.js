import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import { setSeason } from "../stores/redux/settings";
import { getLanguageValue, getColor } from "../helpers/SettingsHelpers";
import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeastScreenTitleView from "../components/homepage/FeastScreenTitleView";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  setCurrentSeasonLive,
  setCurrentSeasonByKey,
} from "../helpers/copticMonthsHelper";

import FeastView from "../components/homepage/feastView";
import FeastModal from "../components/homepage/feastModal";
import SelectYearModal from "../components/homepage/SelectYearModal";
import SearchBar from "../components/ViewTypes/SearchBar";
import Languages from "../constants/languages";
import { getCopticFastsFeasts } from "../helpers/copticMonthsHelper";
function FullFeastsScreen() {
  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.settings.textFontSize);

  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [initialIndex, setInitialIndex] = useState(null);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [feastModalVisible, setFeastModalVisible] = useState(false);
  const flatListRef = useRef();
  const isAndroid = Platform.OS === "ios" ? false : true;
  const [time, setTime] = useState(new Date(timeTransition));

  const snapPoints = ["55%"];
  const bottomSheetRef = useRef(null);

  const data = getCopticFastsFeasts(moment().year()).sort(
    (a, b) =>
      new moment(a.start).format("YYYYMMDD") -
      new moment(b.start).format("YYYYMMDD")
  );
  const [currentData, setCurrentData] = useState(data);
  const [selectedFeast, setSelectedFeast] = useState(data[0]);

  function feastClick(item) {
    setSelectedFeast(item);
    bottomSheetRef?.current.present();
  }

  function yearClick() {
    setYearModalVisible(true);
  }

  function closeYearModal() {
    setYearModalVisible(false);
  }

  function setFeast(feast) {
    const myCurrentSeason = setCurrentSeasonByKey(timeTransition, feast);
    dispatch(setSeason({ currentSeason: myCurrentSeason }));
    bottomSheetRef.current.dismiss();
    Alert.alert("Success");
  }

  function setYear(year) {
    const data = getCopticFastsFeasts(year).sort(
      (a, b) =>
        new moment(a.start).format("YYYYMMDD") -
        new moment(b.start).format("YYYYMMDD")
    );
    setCurrentData(data);
    setYearModalVisible(false);
  }
  function changeDate() {
    Alert.alert("CHANGEDATE");
  }

  function liveClicked() {
    dispatch(
      setSeason({ currentSeason: setCurrentSeasonLive(timeTransition) })
    );
    Alert.alert("Success");
  }

  const today = moment();

  useEffect(() => {
    var todayDate = moment();
    var itemKey = "";

    data.forEach((feast) => {
      if (
        (feast.end === null && feast.start.isSame(todayDate)) ||
        (feast.end !== null &&
          todayDate.isBetween(feast.start, feast.end, null, "[)"))
      ) {
        itemKey = feast.key;
        return;
      }
    });

    var ind = data.findIndex((item) => item.key === itemKey);
    setInitialIndex(ind);
  }, []);

  function renderItems({ item }) {
    return <FeastView item={item} onClick={feastClick} />;
  }

  const onScrollToIndexFailed = (error) => {
    flatListRef.current.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: false,
    });
    setTimeout(() => {
      if (flatListRef.current !== null) {
        flatListRef.current.scrollToIndex({
          index: error.index,
          animated: false,
        });
      }
    }, 10);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    if (time != currentTime) {
      setShowPicker(Platform.OS === "ios");
      dispatch(setTimeTransition({ timeTransition: currentTime }));
      dispatch(setSeason({ currentSeason: setCurrentSeasonLive(currentTime) }));

      setTime(currentTime);
    }
  };
  function handleSearch(text) {
    setSearchPhrase(text);
    const filteredData = data.filter(
      (item) =>
        Languages["eng"][item.key]
          ?.toLowerCase()
          ?.includes(text.toLowerCase()) ||
        Languages["ara"][item.key]?.includes(text)
    );
    setCurrentData(filteredData);
  }

  return (
    <BottomSheetModalProvider>
      <FeastModal
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        setFeast={setFeast}
        feast={selectedFeast}
      />
      <SelectYearModal
        visible={yearModalVisible}
        closeModal={closeYearModal}
        setYear={setYear}
      />
      <View style={styles.container}>
        <FeastScreenTitleView
          liveClicked={liveClicked}
          yearClick={yearClick}
          changeDate={changeDate}
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
          horizontal={false}
          ref={flatListRef}
          onScrollToIndexFailed={onScrollToIndexFailed}
          initialNumToRender={currentData.length}
          initialScrollIndex={initialIndex}
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItems}
          keyExtractor={(item, index) => item.key}
          extraData={currentData} // Ensure that the FlatList updates when currentData changes
        />
      </View>
    </BottomSheetModalProvider>
  );
}

export default FullFeastsScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
