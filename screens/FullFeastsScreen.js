import {
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  useWindowDimensions,
  View,
  Button,
  FlatList,
} from "react-native";
import { setSeason } from "../stores/redux/settings";
import { getLanguageValue, getColor } from "../helpers/SettingsHelpers";
import moment from "moment";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeastScreenTitleView from "../components/homepage/FeastScreenTitleView";
import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import {
  getCopticFastsFeasts,
  setCurrentSeasonByKey,
} from "../helpers/copticMonthsHelper";
import FeastView from "../components/homepage/feastView";
import FeastModal from "../components/homepage/feastModal";
import SelectYearModal from "../components/homepage/SelectYearModal";
import { setCurrentSeasonLive } from "../helpers/copticMonthsHelper";
function FullFeastsScreen() {
  const dispatch = useDispatch();
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  const [initialIndex, setInitialIndex] = useState(null);
  const [yearModalVisible, setyearModalVisible] = useState(false);
  const [yearSelected, setyearSelected] = useState(2023);
  const [feastModalVisible, setfeastModalVisible] = useState(false);
  const flatListRef = useRef();
  const data = getCopticFastsFeasts(yearSelected).sort(
    (a, b) =>
      new moment(a.start).format("YYYYMMDD") -
      new moment(b.start).format("YYYYMMDD")
  );
  const [selectedFeast, setselectedFeast] = useState(data[0]);

  function feastClick(item) {
    setselectedFeast(item);
    setfeastModalVisible(true);
  }
  function yearClick() {
    setyearModalVisible(true);
  }
  function closeModal() {
    setfeastModalVisible(false);
  }
  function closeYearModal() {
    setyearModalVisible(false);
  }
  function setFeast(feast) {
    let mycurrentSeason = setCurrentSeasonByKey(timeTransition, feast);
    dispatch(setSeason({ currentSeason: mycurrentSeason }));

    setfeastModalVisible(false);
  }
  function setYear(year) {
    setyearSelected(year);
    setyearModalVisible(false);
    //setfeastModalVisible(false);
  }
  function liveClicked() {
    setyearSelected(moment().year());

    dispatch(
      setSeason({ currentSeason: setCurrentSeasonLive(timeTransition) })
    );
    Alert.alert("Success");
    //setyearModalVisible(true);
  }
  const today = moment();

  useEffect(() => {
    var todayDate = moment();

    var itemKey = "";
    data.map((feast) => {
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

  function renderItems(itemData) {
    return <FeastView item={itemData.item} onClick={feastClick}></FeastView>;
  }
  return (
    <>
      <FeastModal
        visible={feastModalVisible}
        closeModal={closeModal}
        setFeast={setFeast}
        feast={selectedFeast}
      ></FeastModal>
      <SelectYearModal
        visible={yearModalVisible}
        closeModal={closeYearModal}
        setYear={setYear}
      ></SelectYearModal>
      <View style={styles.container}>
        <FeastScreenTitleView
          liveClicked={liveClicked}
          yearClick={yearClick}
        ></FeastScreenTitleView>
        <FlatList
          data={data}
          horizontal={false}
          ref={flatListRef}
          initialNumToRender={data.length}
          initialScrollIndex={initialIndex}
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItems}
          keyExtractor={(item, index) => {
            return item.key;
          }}
        />
      </View>
    </>
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
