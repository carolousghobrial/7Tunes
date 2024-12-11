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
import {
  useLocalSearchParams,
  useNavigation,
  Link,
  useRouter,
} from "expo-router";
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
  const navigation = useNavigation();
  const router = useRouter();
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const [hasUpdate, setHasUpdate] = useState(false);

  // Memoized colors to avoid re-calculations on each render
  const navBarColor = getColor("NavigationBarColor");
  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
    });
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        setHasUpdate(update.isAvailable); // Set state to true if an update is available
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }

    checkForUpdates();
  }, [navigation]);
  // Share link
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

  // Restore purchases
  const restorePurchase = async () => {
    try {
      const restore = await Purchases.restorePurchases();
      Alert.alert("Purchases restored successfully!");
    } catch (error) {
      Alert.alert("Restore Error", error.message);
    }
  };

  // Check for updates
  const onUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert("New Update!", "Restart the app to apply updates", [
          { text: "Restart", onPress: doUpdate },
        ]);
      } else {
        Alert.alert("No Updates", "Your app is up to date.");
      }
    } catch (error) {
      Alert.alert("Update Error", error.message);
    }
  };

  // Apply update
  const doUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error applying update", e.message);
    }
  };

  const onLongPress = async (item) => {
    try {
      if (item.BishopButton !== undefined) {
        handlePresentModal();
      }
    } catch (e) {}
  };
  // Grant all permissions
  const grantEverything = () => {
    const permissions = [
      "standardPsalmodyPermission",
      "kiahkPsalmodyPermission",
      "paschaBookPermission",
      "holyLiturgyPermission",
    ];

    permissions.forEach((permissionId) =>
      dispatch(setItemPurchased({ permissionId }))
    );
  };
  const buttons = [
    { label: "restore", action: restorePurchase },
    // { label: "update", action: onUpdates },
    { label: "share", action: onShare, onLongPress: grantEverything },
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
                onPress={onUpdates}
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
          <PresentationMode />
          <FontSize />
          <VisibleLangs />
          <PopeBishop />

          <View
            style={[
              styles.container,
              {
                borderColor: pageBackgroundColor,
                backgroundColor: navBarColor,
              },
            ]}
          >
            {buttons.map(({ label, action, onLongPress }, index) => (
              <CustomButton
                key={index}
                onPress={action}
                onLongPress={onLongPress}
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
  container: {
    flex: 1,
  },
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
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16, // Adjust padding as needed
  },
  button: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff", // Adjust as needed
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // Adjust color to fit your theme
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontFamily: "english-font",
  },
});

export default SettingsScreen;
