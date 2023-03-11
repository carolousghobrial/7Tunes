import {
  StyleSheet,
  Dimensions,
  Text,
  useWindowDimensions,
  View,
  Button,
  FlatList,
} from "react-native";
import { getLanguageValue, getColor } from "../helpers/SettingsHelpers";
import moment from "moment";
import React, { useState, useRef, useEffect } from "react";

import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import { getCopticFastsFeasts } from "../helpers/copticMonthsHelper";
import FeastView from "../components/homepage/feastView";
function FullFeastsScreen() {
  const flatListRef = useRef();

  function feastClick(item) {
    item;
  }
  const data = getCopticFastsFeasts().sort(
    (a, b) =>
      new moment(a.start).format("YYYYMMDD") -
      new moment(b.start).format("YYYYMMDD")
  );

  function renderItems(itemData) {
    return <FeastView item={itemData.item} onClick={feastClick}></FeastView>;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal={false}
        ref={flatListRef}
        initialScrollIndex={15}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItems}
        keyExtractor={(item, index) => {
          return item.key;
        }}
      />
    </View>
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
