import {
  StyleSheet,
  Dimensions,
  Text,
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

import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import {
  getCopticFastsFeasts,
  setCurrentSeasonByKey,
} from "../helpers/copticMonthsHelper";
import FeastView from "../components/homepage/feastView";
import FeastModal from "../components/homepage/feastModal";
function FullFeastsScreen() {
  const dispatch = useDispatch();
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  const data = getCopticFastsFeasts().sort(
    (a, b) =>
      new moment(a.start).format("YYYYMMDD") -
      new moment(b.start).format("YYYYMMDD")
  );
  const [initialIndex, setInitialIndex] = useState(null);
  const [feastModalVisible, setfeastModalVisible] = useState(false);
  const [selectedFeast, setselectedFeast] = useState(data[0]);
  const flatListRef = useRef();

  function feastClick(item) {
    setselectedFeast(item);
    setfeastModalVisible(true);
  }
  function closeModal() {
    setfeastModalVisible(false);
  }
  function setFeast(feast) {
    let mycurrentSeason = setCurrentSeasonByKey(timeTransition, feast);
    dispatch(setSeason({ currentSeason: mycurrentSeason }));

    setfeastModalVisible(false);
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
      <View style={styles.container}>
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
