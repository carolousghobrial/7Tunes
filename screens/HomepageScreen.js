import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Glassfy } from "react-native-glassfy-module";
import { getColor } from "../helpers/SettingsHelpers.js";
import homescreenPaths from "../helpers/homescreenPaths";
import { setItemPurchased } from "../stores/redux/settings";
import BookView from "../components/homepage/bookView";
import BishopModal from "./BishopModal.js";
import * as Updates from "expo-updates";

const isStandardBoughtSelector = (state) =>
  state.settings.standardPsalmodyPermission;
const isKiahkBoughtSelector = (state) => state.settings.kiahkPsalmodyPermission;
const isPaschaBoughtSelector = (state) => state.settings.paschaBookPermission;

function HomepageScreen({ navigation, route }) {
  const labelColor = getColor("LabelColor");
  const data = homescreenPaths[route.params.bookPath];
  const isStandardBought = useSelector(isStandardBoughtSelector);
  const isKiahkBought = useSelector(isKiahkBoughtSelector);
  const isPaschaBought = useSelector(isPaschaBoughtSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [bishopModalVisible, setbishopModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    onFetchUpdateAsync();
  }, [navigation]);

  const onFetchUpdateAsync = async () => {
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
      // alert(`Error fetching latest Expo update: ${error}`);
    }
  };

  const onUpdates = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  const bookClick = async (item) => {
    const {
      PermissionStatus,
      Released,
      Enabled,
      PurchaseKey,
      BookPath,
      EnglishTitle,
      ArabicTitle,
      mother,
    } = item;
    const isBought = (() => {
      switch (PermissionStatus) {
        case "standardPsalmodyPermission":
          return isStandardBought;
        case "kiahkPsalmodyPermission":
          return isKiahkBought;
        case "paschaBookPermission":
          return isPaschaBought;
        default:
          return false;
      }
    })();

    if (Released === false) {
      Alert.alert("Will be Released Soon....");
      return;
    } else if (Enabled === false) {
      setIsLoading(true);

      if (!isBought) {
        await Glassfy.restorePurchases();
        const permissions = await Glassfy.permissions();
        const BookPermission = permissions.all.find(
          (permission) => permission.permissionId === PermissionStatus
        );

        if (BookPermission.isValid === false) {
          const offerings = await Glassfy.offerings();
          const OfferingToBuy = offerings.all.find(
            (offering) => offering.offeringId === PurchaseKey
          ).skus[0];
          try {
            const transaction = await Glassfy.purchaseSku(OfferingToBuy);
            const permission = transaction.permissions.all.find(
              (p) => p.permissionId === PermissionStatus
            );

            if (permission && permission.isValid) {
              dispatch(
                setItemPurchased({ permissionId: permission.permissionId })
              );
            } else {
              setIsLoading(false);
              return;
            }
          } catch (error) {
            Alert.alert(error.toString());
            setIsLoading(false);
            return;
          }
        } else {
          dispatch(
            setItemPurchased({ permissionId: BookPermission.permissionId })
          );
        }
      }
    }

    setIsLoading(false);

    if (item.hasSubBooks) {
      navigation.navigate("HomepageScreen", {
        bookPath: BookPath,
        englishTitle: EnglishTitle,
        arabicTitle: ArabicTitle,
      });
    } else {
      if (mother !== undefined) {
        navigation.navigate("BookScreen", {
          bookPath: BookPath,
          englishTitle: EnglishTitle,
          arabicTitle: ArabicTitle,
          motherSource: mother,
        });
      } else {
        navigation.navigate("BookScreen", {
          bookPath: BookPath,
          englishTitle: EnglishTitle,
          arabicTitle: ArabicTitle,
        });
      }
    }
  };

  const onLongPress = async (item) => {
    if (item.BishopButton !== undefined) {
      setbishopModalVisible(true);
    }
  };

  return (
    <>
      <BishopModal
        visible={bishopModalVisible}
        closeModal={() => setbishopModalVisible(false)}
      />
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator size="large" color="black" /> : null}
        <FlatList
          data={data.books}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookView
              onLongPress={onLongPress}
              item={item}
              onClick={bookClick}
            />
          )}
          numColumns={2}
          keyExtractor={(item) => item.BookPath}
        />
      </View>
    </>
  );
}

export default HomepageScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
