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

function SettingsScreen({ navigation, route }) {
  return (
    <ScrollView style={styles.container}>
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
    flex: 1,
    margin: 8,
    padding: 8,
  },
});
