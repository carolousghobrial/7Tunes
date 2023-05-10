import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { Asset } from "expo-asset";

import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getLanguageValue, getColor } from "../helpers/SettingsHelpers";
import { Glassfy, GlassfySku } from "react-native-glassfy-module";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import * as Updates from "expo-updates";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import TopBoxView from "../components/homepage/topBoxView";
const CustomDrawerScreen = (props) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out the Application 7 Tunes " +
          "\n" +
          "To download on iOS and the App Store: " +
          "https://apps.apple.com/us/app/7-tunes/id1545089530 " +
          "\n" +
          "To download on Google Play: " +
          "https://play.google.com/store/apps/details?id=com.seventunes.tasbehafinal" +
          "\n",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const onUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert("New Update!", "Please restart the app to apply updates", [
          {
            text: "Restart the App",
            onPress: () => doUpdate(),
          },
        ]);
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };
  async function doUpdate() {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
  const RestorePurchase = async () => {
    try {
      await Glassfy.restorePurchases();
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const ShareIcon = () => {
    return <Entypo name="share" size={24} color="black" />;
  };
  const RestoreIcon = () => {
    return <MaterialCommunityIcons name="restore" size={24} color={"black"} />;
  };

  const CommentIcon = () => {
    return <FontAwesome name="question-circle" size={24} color="black" />;
  };
  const FacebookIcon = () => {
    return <Entypo name="facebook" size={24} color="black" />;
  };
  const InstagramIcon = () => {
    return <Entypo name="instagram" size={24} color="black" />;
  };
  const UpdateIcon = () => {
    return <MaterialCommunityIcons name="update" size={24} color={"black"} />;
  };
  return (
    <ImageBackground
      source={require("../assets/images/copticBackground.png")}
      resizeMode="cover"
      style={styles.backgroundimage}
    >
      <DrawerContentScrollView {...props}>
        <TopBoxView></TopBoxView>
        <DrawerItemList {...props}></DrawerItemList>
        <DrawerItem
          icon={ShareIcon}
          label={getLanguageValue("share")}
          onPress={onShare}
        />
        <DrawerItem
          icon={RestoreIcon}
          label={getLanguageValue("restore")}
          onPress={RestorePurchase}
        />
        <DrawerItem
          icon={CommentIcon}
          label={getLanguageValue("commentsOrQuestions")}
          onPress={() => Linking.openURL("https://forms.gle/kY4ZqxVcVrKSVhmq5")}
        />
        <DrawerItem
          icon={FacebookIcon}
          label={getLanguageValue("facebook")}
          onPress={() => Linking.openURL("fb://page/101887968498785")}
        />
        <DrawerItem
          icon={InstagramIcon}
          label={getLanguageValue("instagram")}
          onPress={() => Linking.openURL("instagram://user?username=7tunes_")}
        />
        <DrawerItem
          icon={UpdateIcon}
          label={getLanguageValue("update")}
          onPress={onUpdates}
        />
      </DrawerContentScrollView>
    </ImageBackground>
  );
};

export default CustomDrawerScreen;

const styles = StyleSheet.create({
  backgroundimage: {
    resizeMode: "cover",
    justifyContent: "center",
    flex: 1,
  },
});
