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
import SaintsList from "../components/settings/saintsList";
import TodaysPrayer from "../components/settings/todaysPrayer";
import PopeBishop from "../components/settings/popeBishop";
import PresentationMode from "../components/settings/presentationMode";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
function SettingsScreen({ navigation, route }) {
  return (
    <ScrollView style={{ backgroundColor: getColor("pageBackgroundColor") }}>
      <ApplicationLanguage></ApplicationLanguage>
      <AppTheme></AppTheme>
      <TodaysPrayer></TodaysPrayer>
      <PresentationMode></PresentationMode>
      <FontSize></FontSize>
      <VisibleLangs></VisibleLangs>
      <PopeBishop></PopeBishop>
    </ScrollView>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});
