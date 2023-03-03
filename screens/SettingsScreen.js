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
      <AppTheme key="0"></AppTheme>
      <TodaysPrayer key="2"></TodaysPrayer>
      <ApplicationLanguage key="3"></ApplicationLanguage>
      <FontSize key="4"></FontSize>
      <Test key="5"></Test>
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
