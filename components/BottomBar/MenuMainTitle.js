import {
  View,
  Switch,
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors.js";
import { useDispatch, useSelector } from "react-redux";
import { changeTextLanguage } from "../../stores/redux/settings.js";
import { useNavigation } from "@react-navigation/native";

function MenuMainTitle({ item }) {
  const navigation = useNavigation();
  let flexDirection = "row";
  if (Platform.OS == "android") {
    flexDirection = "row-reverse";
  }
  const fontSize = useSelector((state) => state.settings.textFontSize);
  return (
    <View
      style={{
        borderColor: getColor("LabelColor"),
        backgroundColor: getColor("NavigationBarColor"),
      }}
    >
      <ImageBackground
        source={require("../../assets/images/titleBackground.png")}
      >
        <View style={{ marginTop: 30, flexDirection: flexDirection }}>
          <Pressable
            style={styles.closeView}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={30}
              style={{ marginRight: 10 }}
              color={getColor("LabelColor")}
            />
          </Pressable>
          <View style={styles.titleView}>
            <View style={styles.textView}>
              <Text
                style={[
                  styles.english,
                  { fontSize: fontSize * 0.9, color: getColor("LabelColor") },
                ]}
              >
                {item.EnglishTitle}
              </Text>
            </View>
            {item.CopticTitle !== undefined ? (
              <View style={styles.textView}>
                <Text
                  style={[
                    styles.coptic,
                    { fontSize: fontSize * 0.9, color: getColor("LabelColor") },
                  ]}
                >
                  {item.CopticTitle}
                </Text>
              </View>
            ) : null}
            <View style={styles.textView}>
              <Text
                style={[
                  styles.arabic,
                  { fontSize: fontSize * 0.9, color: getColor("LabelColor") },
                ]}
              >
                {item.ArabicTitle}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  textView: {
    margin: 2,
    justifyContent: "center",
  },
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "justify",
    justifyContent: "center",
    textAlign: "center",
  },
  closeView: {
    flex: 1,
  },
  titleView: {
    flex: 9,
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "justify",
    writingDirection: "rtl",
    justifyContent: "center",
    textAlign: "center",
  },
  english: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default MenuMainTitle;
