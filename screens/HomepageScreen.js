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
import { Glassfy, GlassfySku } from "react-native-glassfy-module";
import { useDispatch, useSelector } from "react-redux";
import { setItemPurchased } from "../stores/redux/settings";

function HomepageScreen({ navigation, route }) {
  const data = homescreenPaths[route.params.bookPath];
  const isStandardBought = useSelector((state) => state.settings.standardPsalmodyPermission);
  const isKiahkBought = useSelector((state) => state.settings.kiahkPsalmodyPermission);
  const isPaschaBought = useSelector((state) => state.settings.paschaBookPermission);
  const dispatch = useDispatch();
  Dimensions.addEventListener('change', (dimensions) => {
    // you get:
    console.log("ASDAD");
    //  dimensions.window.width
    //  dimensions.window.height
    //  dimensions.screen.width
    //  dimensions.screen.height
  });
  async function bookClick(item) {
    var isBought = false;
    switch(item.PermissionStatus){
      case "standardPsalmodyPermission":
        isBought = isStandardBought;
        break;
        case "kiahkPsalmodyPermission":
          isBought = isKiahkBought;
          break;
        case "paschaBookPermission":
          isBought = isPaschaBought;
          break;
    }
    if (item.Released === false) {
      Alert.alert("Will be Released Soon....");
      return;
    } else if (item.Enabled === false) {
      if(!isBought){
        const permissions = await Glassfy.permissions();
        const offerings = await Glassfy.offerings();
        const BookPermission = permissions.all.find((permission) => permission.permissionId === item.PermissionStatus);
        if(BookPermission.isValid === false){
          const OfferingToBuy = offerings.all.find((offering) => offering.offeringId === item.PurchaseKey).skus[0];
          try {
            const transaction =  await Glassfy.purchaseSku(OfferingToBuy);
            const permission = transaction.permissions.all.find((p) => p.permissionId === item.PermissionStatus);
            if (permission && permission.isValid) {
                // unlock aFeature
                dispatch(setItemPurchased({ permissionId: permission.permissionId }));
            }
            else{
              return;
            }
          } catch (error) {
            Alert.alert(error.toString());
            return;
          }
        }
        else{
          dispatch(setItemPurchased({ permissionId: BookPermission.permissionId }));
        }
      }
    } 
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
  };

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
