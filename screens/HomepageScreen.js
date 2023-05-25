import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  useWindowDimensions,
  View,
  Alert,
  Button,
  Pressable,
  FlatList,
  Text,
} from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { PurchaseItem } from "../helpers/InAppPurchases";
import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import { getFullViewModel } from "../viewModel/getFullViewModel";
import React, { useState, useEffect } from "react";
import { Glassfy, GlassfySku } from "react-native-glassfy-module";

import { useDispatch, useSelector } from "react-redux";
import { setItemPurchased } from "../stores/redux/settings";
import * as ScreenOrientation from "expo-screen-orientation";

function HomepageScreen({ navigation, route }) {
  let labelColor = getColor("LabelColor");

  const data = homescreenPaths[route.params.bookPath];
  const isStandardBought = useSelector(
    (state) => state.settings.standardPsalmodyPermission
  );
  const isKiahkBought = useSelector(
    (state) => state.settings.kiahkPsalmodyPermission
  );
  const isPaschaBought = useSelector(
    (state) => state.settings.paschaBookPermission
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const dispatch = useDispatch();

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert("New Update!", "Please restart the app to apply updates", [
          {
            text: "Restart the App",
            onPress: () => onUpdates(),
          },
        ]);
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      //alert(`Error fetching latest Expo update: ${error}`);
    }
  }
  useEffect(() => {
    onFetchUpdateAsync();
  }, [navigation]);

  const onUpdates = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };
  async function bookClick(item) {
    var isBought = false;
    switch (item.PermissionStatus) {
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
    }
    // else if (item.Enabled === false) {
    //   setIsLoading(true);

    //   if (!isBought) {
    //     await Glassfy.restorePurchases();
    //     const permissions = await Glassfy.permissions();
    //     const BookPermission = permissions.all.find(
    //       (permission) => permission.permissionId === item.PermissionStatus
    //     );
    //     if (BookPermission.isValid === false) {
    //       const offerings = await Glassfy.offerings();
    //       const OfferingToBuy = offerings.all.find(
    //         (offering) => offering.offeringId === item.PurchaseKey
    //       ).skus[0];
    //       try {
    //         const transaction = await Glassfy.purchaseSku(OfferingToBuy);
    //         const permission = transaction.permissions.all.find(
    //           (p) => p.permissionId === item.PermissionStatus
    //         );
    //         if (permission && permission.isValid) {
    //           // unlock aFeature
    //           dispatch(
    //             setItemPurchased({ permissionId: permission.permissionId })
    //           );
    //         } else {
    //           setIsLoading(false);

    //           return;
    //         }
    //       } catch (error) {
    //         Alert.alert(error.toString());
    //         setIsLoading(false);
    //         return;
    //       }
    //     } else {
    //       dispatch(
    //         setItemPurchased({ permissionId: BookPermission.permissionId })
    //       );
    //     }
    //   }
    // }
    setIsLoading(false);

    if (item.hasSubBooks) {
      navigation.push("HomepageScreen", {
        bookPath: item.BookPath,
        englishTitle: item.EnglishTitle,
        arabicTitle: item.ArabicTitle,
      });
    } else {
      if (item.mother !== undefined) {
        navigation.push("BookScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
          motherSource: item.mother,
        });
      } else {
        navigation.push("BookScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator size="large" color="black" /> : null}
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
