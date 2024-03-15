import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  AppState,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import bookPaths from "../helpers/bookPathsHelpers";
import { store, persistor } from "../stores/redux/store";
import SearchBar from "../components/ViewTypes/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { Glassfy } from "react-native-glassfy-module";
import { getColor } from "../helpers/SettingsHelpers.js";
import homescreenPaths from "../helpers/homescreenPaths";
import { setItemPurchased } from "../stores/redux/settings";
import BookView from "../components/homepage/bookView";
import BishopModal from "./BishopModal.js";
import * as Updates from "expo-updates";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheet,
} from "@gorhom/bottom-sheet";
import { setSeason } from "../stores/redux/settings.js";

import { setCurrentSeasonLive } from "../helpers/copticMonthsHelper";
import Onboarding from "./OnBoardingScreen.js";
import BishopPresentView from "./BishopPresentView.js";
import { TouchableOpacity } from "react-native-gesture-handler";

function HomepageScreen({ navigation, route }) {
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const searchTerm = "John"; // The value you want to search for
  const results = [];
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const labelColor = getColor("LabelColor");

  useEffect(() => {
    const headerRightComponent = () => (
      <TouchableOpacity onPress={handlePresentModal}>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <MaterialCommunityIcons
            name="cross-outline"
            size={12}
            color={labelColor}
          />
          <Text style={{ fontSize: 13, fontWeight: "bold", color: labelColor }}>
            Bishop Present?
          </Text>
          <MaterialCommunityIcons
            name="cross-outline"
            size={12}
            color={labelColor}
          />
        </View>
      </TouchableOpacity>
    );
    navigation.setOptions({
      headerShown: true,
      headerRight: headerRightComponent,
    });
  }, [onboardingViewed]);
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = ["75%"];

  function handlePresentModal() {
    bottomSheetRef?.current.present();
  }
  const data = homescreenPaths[route.params.bookPath].books.filter((item) => {
    const currentSeason = useSelector((state) => state.settings.currentSeason);

    if (item.Visible === "ShowVespers") {
      if (currentSeason.key === "JONAH_FAST") {
        return; // No need to return anything if item should not be shown
      }

      if (currentSeason.key === "GREAT_LENT" && currentSeason.dayOfWeek !== 0) {
        return; // No need to return anything if it's not Sunday during Great Lent
      }
    }

    if (item.Visible === "ShowEveningPrayer") {
      if (currentSeason.key === "GREAT_LENT") {
        if (currentSeason.dayOfWeek === 0) {
          return item;
        }
      }
      return;
    }

    return item; // Return the item if it passes all the conditions
  });
  const isStandardBought = useSelector(
    (state) => state.settings.standardPsalmodyPermission
  );
  const isKiahkBought = useSelector(
    (state) => state.settings.kiahkPsalmodyPermission
  );
  const isPaschaBought = useSelector(
    (state) => state.settings.paschaBookPermission
  );
  const isLiturgyBought = useSelector(
    (state) => state.settings.holyLiturgyPermission
  );
  const onboardingViewed = useSelector(
    (state) => state.settings.onboardingViewed
  );
  const [isLoading, setIsLoading] = useState(false);
  const [bishopModalVisible, setbishopModalVisible] = useState(false);
  const dispatch = useDispatch();
  function handleSearch(text) {
    setSearchPhrase(text);
  }
  var updateString =
    "Added Readings for 2nd Week of Lent, more to come \n Added Evening Prayers to only be shown on Sunday \n Miscellaneous Spelling and Bug Fixes\n Hide Vespers during Weekdays of Lent \n Added ExpandableView\n Added Covenant Thursday Liturgy";
  useEffect(() => {
    onFetchUpdateAsync();
  }, [navigation]);
  function setLive() {
    dispatch(
      setSeason({ currentSeason: setCurrentSeasonLive(timeTransition) })
    );
  }
  const onFetchUpdateAsync = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert("New Update!", updateString, [
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
      case "holyLiturgyPermission":
        isBought = isLiturgyBought;
        break;
    }

    if (item.Released === false) {
      Alert.alert("Will be Released Soon....");
      return;
    } else if (item.Enabled === false) {
      setIsLoading(true);
      if (!isBought) {
        await Glassfy.restorePurchases();

        const permissions = await Glassfy.permissions();
        // console.log(permissions);
        const BookPermission = permissions.all.find(
          (permission) => permission.permissionId === item.PermissionStatus
        );
        if (BookPermission.isValid === false) {
          const offerings = await Glassfy.offerings();
          const OfferingToBuy = offerings.all.find(
            (offering) => offering.offeringId === item.PurchaseKey
          ).skus[0];
          try {
            const transaction = await Glassfy.purchaseSku(OfferingToBuy);
            const permission = transaction.permissions.all.find(
              (p) => p.permissionId === item.PermissionStatus
            );
            if (permission && permission.isValid) {
              // unlock aFeature
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
          bishopButton: item.BishopButton,
        });
      } else {
        navigation.push("BookScreen", {
          bookPath: item.BookPath,
          englishTitle: item.EnglishTitle,
          arabicTitle: item.ArabicTitle,
          bishopButton: item.BishopButton,
        });
      }
    }
  }

  const onLongPress = async (item) => {
    try {
      if (item.BishopButton !== undefined) {
        handlePresentModal();
      }
    } catch (e) {}
  };
  return (
    <BottomSheetModalProvider>
      <BishopModal bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      {onboardingViewed === false ? (
        <Onboarding navigation={navigation} />
      ) : (
        <View style={styles.container}>
          {isLoading ? <ActivityIndicator size="large" color="black" /> : null}
          <FlatList
            data={data}
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
      )}
    </BottomSheetModalProvider>
  );
}

export default HomepageScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
