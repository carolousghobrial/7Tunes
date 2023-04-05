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
import React, { useState, useEffect } from "react";
import { Glassfy } from "react-native-glassfy-module";

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
    }
  };
  useEffect(() => {
    async function prepare() {
      try {
        await Glassfy.initialize("68561c8cc6994fb2af25a34a19a5554f", false);
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
