import {
  View,
  Switch,
  StyleSheet,
  Text,
  ImageBackground,
  FlatList,
} from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors.js";
import { useDispatch, useSelector } from "react-redux";
import { changeTextLanguage } from "../../stores/redux/settings.js";

function MenuMainTitle({ item }) {
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
