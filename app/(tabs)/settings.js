import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
  StyleSheet,
  Share,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ApplicationLanguage from "../../components/settings/applicationLanguage.js";
import AppTheme from "../../components/settings/appTheme.js";
import FontSize from "../../components/settings/fontSize.js";
import VisibleLangs from "../../components/settings/visibleLangs.js";
import TodaysPrayer from "../../components/settings/todaysPrayer.js";
import PresentationMode from "../../components/settings/presentationMode.js";
import PopeBishop from "../../components/settings/popeBishop.js";
import Purchases from "react-native-purchases";
import * as Updates from "expo-updates";
import { setItemPurchased } from "../../stores/redux/settings";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";

const permissions = [
  "standardPsalmodyPermission",
  "kiahkPsalmodyPermission",
  "paschaBookPermission",
  "holyLiturgyPermission",
];

const buttons = [
  { label: "restore", action: "restorePurchase" },
  { label: "share", action: "onShare", onLongPress: "grantEverything" },
  {
    label: "facebook",
    action: () => Linking.openURL("fb://page/101887968498785"),
  },
  {
    label: "commentsOrQuestions",
    action: () => Linking.openURL("https://forms.gle/kY4ZqxVcVrKSVhmq5"),
  },
  {
    label: "instagram",
    action: () => Linking.openURL("instagram://user?username=7tunes_"),
  },
];

const CustomButton = ({ onPress, label, fontSize, onLongPress }) => (
  <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
    <View style={styles.button}>
      <Text style={[styles.buttonText, { fontSize }]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

function SettingsScreen() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const dispatch = useDispatch();
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const navBarColor = getColor("NavigationBarColor");
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        setHasUpdate(update.isAvailable);
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }

    checkForUpdates();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Check out the Application 7 Tunes\nDownload on iOS: https://apps.apple.com/us/app/7-tunes/id1545089530\nDownload on Google Play: https://play.google.com/store/apps/details?id=com.seventunes.tasbehafinal",
      });
    } catch (error) {
      Alert.alert("Error sharing", error.message);
    }
  };

  const restorePurchase = async () => {
    try {
      await Purchases.restorePurchases();
      Alert.alert("Purchases restored successfully!");
    } catch (error) {
      Alert.alert("Restore Error", error.message);
    }
  };

  const grantEverything = () => {
    permissions.forEach((permissionId) =>
      dispatch(setItemPurchased({ permissionId }))
    );
  };

  const handleUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert("New Update!", "Restart the app to apply updates", [
          { text: "Restart", onPress: applyUpdate },
        ]);
      } else {
        Alert.alert("No Updates", "Your app is up to date.");
      }
    } catch (error) {
      Alert.alert("Update Error", error.message);
    }
  };

  const applyUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      Alert.alert("Error applying update", error.message);
    }
  };

  const actionHandlers = {
    restorePurchase,
    onShare: handleShare,
    grantEverything,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: pageBackgroundColor }]}
    >
      <ImageBackground
        source={require("../../assets/images/copticBackground.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {hasUpdate && (
            <View>
              <CustomButton
                onPress={handleUpdate}
                label={getLanguageValue("update")}
                fontSize={fontSize}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </View>
          )}
          <ApplicationLanguage />
          <AppTheme />
          <TodaysPrayer />
          <FontSize />
          <VisibleLangs />
          <PopeBishop />
          <View
            style={[
              styles.smallContainer,
              {
                borderColor: pageBackgroundColor,
                backgroundColor: navBarColor,
              },
            ]}
          >
            {buttons.map(({ label, action, onLongPress }, index) => (
              <CustomButton
                key={index}
                onPress={
                  typeof action === "function" ? action : actionHandlers[action]
                }
                onLongPress={onLongPress && actionHandlers[onLongPress]}
                label={getLanguageValue(label)}
                fontSize={fontSize}
              />
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  smallContainer: { margin: 10, padding: 10, borderRadius: 10 },
  badge: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "bold" },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  scrollViewContent: { flexGrow: 1, padding: 16 },
  button: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SettingsScreen;
