import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Pressable,
  Alert,
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
import { setItemPurchased } from "../../stores/redux/settings.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers.js";
import {
  useLocalSearchParams,
  useNavigation,
  Link,
  useRouter,
} from "expo-router";
function SettingsScreen() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
  const headerfontSize = isTablet ? 30 : 15;
  const isTablet = useSelector((state) => state.settings.isTablet);

  // Memoized colors to avoid re-calculations on each render
  const pageBackgroundColor = getColor("PrimaryColor");
  const navBarColor = getColor("NavigationBarColor");
  const title = appLanguage === "eng" ? "Settings" : "إعدادات";
  const labelColor = getColor("LabelColor");
  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: title,
      headerStyle: {
        backgroundColor: navBarColor,
      },
      headerTitleStyle: {
        fontSize: headerfontSize,
        fontFamily: fontFamily,
        color: labelColor,
      },
      headerRight: () => (
        <Pressable
          onPressIn={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      ),
    });
  }, [labelColor]);
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
      await Purchases.restorePurchases();
      Alert.alert("Purchases restored successfully!");
    } catch (error) {
      Alert.alert("Restore Error", error.message);
    }
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

  return (
    <ScrollView>
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
        <Text
          style={[
            styles.title,
            { fontSize: fontSize * 1.3, color: pageBackgroundColor },
          ]}
        >
          {getLanguageValue("backgroundselector")}
        </Text>

        <TouchableOpacity
          onLongPress={grantEverything}
          onPress={restorePurchase}
        >
          <View style={styles.button}>
            <Text style={[styles.buttonText, { fontSize }]}>
              {getLanguageValue("restore")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare}>
          <View style={styles.button}>
            <Text style={[styles.buttonText, { fontSize }]}>
              {getLanguageValue("share")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("fb://page/101887968498785")}
        >
          <View style={styles.button}>
            <Text style={[styles.buttonText, { fontSize }]}>
              {getLanguageValue("facebook")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("instagram://user?username=7tunes_")}
        >
          <View style={styles.button}>
            <Text style={[styles.buttonText, { fontSize }]}>
              {getLanguageValue("instagram")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontFamily: "english-font",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#AA4A44",
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "transparent", // Ensure no visual conflicts
  },
  closeButtonPressed: {
    opacity: 0.6, // Visual feedback on press
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
  },
  buttonText: {
    color: "black",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SettingsScreen;
