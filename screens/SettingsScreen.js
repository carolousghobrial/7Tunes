import {
  StyleSheet,
  Dimensions,
  Text,
  useWindowDimensions,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import ApplicationLanguage from "../components/settings/applicationLanguage";
import AppTheme from "../components/settings/appTheme";
import FontSize from "../components/settings/fontSize";
import VisibleLangs from "../components/settings/visibleLangs";
import TodaysPrayer from "../components/settings/todaysPrayer";
import Test from "../components/settings/test";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
function SettingsScreen({ navigation, route }) {
  return (
    <ScrollView style={{ backgroundColor: getColor("pageBackgroundColor") }}>
      <AppTheme></AppTheme>
      <TodaysPrayer></TodaysPrayer>
      <ApplicationLanguage></ApplicationLanguage>
      <FontSize></FontSize>
      <VisibleLangs></VisibleLangs>
    </ScrollView>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});
