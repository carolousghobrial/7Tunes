import React, { useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Alert,
  Share,
  Linking,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import {
  setSeason,
  setIsTablet,
  setItemPurchased,
} from "../stores/redux/settings";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Updates from "expo-updates";
import { getLanguageValue } from "../helpers/SettingsHelpers";
import TopBoxView from "../components/homepage/topBoxView";
import * as Glassfy from "react-native-glassfy-module";

const CustomDrawerScreen = (props) => {
  const dispatch = useDispatch();
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  useEffect(() => {
    async function prepare() {
      try {
        const isTablet = (await Device.getDeviceTypeAsync()) === 2;
        dispatch(setIsTablet({ isTablet }));
      } catch (e) {
        console.error("Error detecting device type:", e);
      }
    }
    prepare();
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Check out the Application 7 Tunes " +
          "\n" +
          "Download on iOS: https://apps.apple.com/us/app/7-tunes/id1545089530 " +
          "\n" +
          "Download on Google Play: https://play.google.com/store/apps/details?id=com.seventunes.tasbehafinal",
      });
    } catch (error) {
      Alert.alert("Error sharing", error.message);
    }
  };

  const onUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert("New Update!", "Restart the app to apply updates", [
          { text: "Restart", onPress: () => doUpdate() },
        ]);
      } else {
        Alert.alert("No Updates", "Your app is up to date.");
      }
    } catch (error) {
      Alert.alert("Update Error", error.message);
    }
  };

  const doUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error applying update", e.message);
    }
  };

  const RestorePurchase = async () => {
    try {
      await Glassfy.restorePurchases();
      Alert.alert("Purchases restored successfully!");
    } catch (error) {
      Alert.alert("Restore Error", error.message);
    }
  };

  const GrantEverything = () => {
    dispatch(setItemPurchased({ permissionId: "standardPsalmodyPermission" }));
    dispatch(setItemPurchased({ permissionId: "kiahkPsalmodyPermission" }));
    dispatch(setItemPurchased({ permissionId: "paschaBookPermission" }));
    dispatch(setItemPurchased({ permissionId: "holyLiturgyPermission" }));
  };

  return (
    <ImageBackground
      source={require("../assets/images/copticBackground.png")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <TopBoxView />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          icon={() => <Entypo name="share" size={24} color="black" />}
          label={getLanguageValue("share")}
          onPress={onShare}
        />
        <DrawerItem
          icon={() => (
            <MaterialCommunityIcons name="restore" size={24} color="black" />
          )}
          label={getLanguageValue("restore")}
          onPress={RestorePurchase}
        />
        <DrawerItem
          icon={() => (
            <FontAwesome name="question-circle" size={24} color="black" />
          )}
          label={getLanguageValue("commentsOrQuestions")}
          onPress={() => Linking.openURL("https://forms.gle/kY4ZqxVcVrKSVhmq5")}
        />
        <DrawerItem
          icon={() => <Entypo name="facebook" size={24} color="black" />}
          label={getLanguageValue("facebook")}
          onPress={() => Linking.openURL("fb://page/101887968498785")}
        />
        <DrawerItem
          icon={() => <Entypo name="instagram" size={24} color="black" />}
          label={getLanguageValue("instagram")}
          onPress={() => Linking.openURL("instagram://user?username=7tunes_")}
        />
        <DrawerItem
          icon={() => (
            <MaterialCommunityIcons name="update" size={24} color="black" />
          )}
          label={getLanguageValue("update")}
          onPress={onUpdates}
        />
        <DrawerItem
          label=""
          onPress={GrantEverything}
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </DrawerContentScrollView>
    </ImageBackground>
  );
};

export default CustomDrawerScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
});
