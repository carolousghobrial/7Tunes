import {
  StyleSheet,
  Dimensions,
  Text,
  useWindowDimensions,
  View,
  Alert,
  Button,
  FlatList,
} from "react-native";
import { PurchaseItem } from "../helpers/InAppPurchases";
import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import { getFullViewModel } from "../viewModel/getFullViewModel";
import React, { useState,useEffect } from "react";
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
const APIKeys = {
  apple: "appl_oogcAbHhpVioRDVOZirgjMACtKc",
  google: "goog_JIchqPHcTjhcgcZJClMLTDukueM",
};
 function HomepageScreen({ navigation, route }) {
  const data = homescreenPaths[route.params.bookPath];
  const bookClick = async (item) => {
    if (item.Released === false) {
      Alert.alert("Will be Released Soon....");
    } else if (item.Enabled) {
      if (item.hasSubBooks) {
        navigation.push("HomepageScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
        });
      } else {
        navigation.push("BookScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
        });
      }
    } else {
      console.log(await Purchases.getOfferings())



    }
  };
  useEffect(() => {
    async function prepare() {
      try {

        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        if (Platform.OS === 'ios') {
            await Purchases.configure({ apiKey: APIKeys.apple });
        } else if (Platform.OS === 'android') {
            await Purchases.configure({ apiKey: APIKeys.google });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={data.books}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => {
          return <BookView item={item.item} onClick={bookClick} />;
        }}
        numColumns={2}
        keyExtractor={(item, index) => {
          return item.BookPath;
        }}
      />
    </View>
  );
}

export default HomepageScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
