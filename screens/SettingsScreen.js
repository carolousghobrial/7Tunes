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
import Test from "../components/settings/test";
import TodaysPrayer from "../components/settings/todaysPrayer";

function SettingsScreen({ navigation, route }) {
  return (
    <ScrollView style={styles.container}>
      <TodaysPrayer></TodaysPrayer>
      <ApplicationLanguage></ApplicationLanguage>
      <FontSize></FontSize>
      <AppTheme></AppTheme>
      <Test></Test>
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
