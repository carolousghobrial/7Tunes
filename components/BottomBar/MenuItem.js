import {
  View,
  Switch,
  StyleSheet,
  Text,
  Pressable,
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

function MenuItem({ item, HighlitedIndex, scrollToKey }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  var SelectedbackgroundColor = "transparent";
  function functionCombined() {
    scrollToKey(item.key);
  }
  if (item.key === HighlitedIndex) {
    SelectedbackgroundColor = getColor("pageBackgroundColor");
  }
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: getColor("PrimaryColor"),
          backgroundColor: SelectedbackgroundColor,
        },
      ]}
    >
      <Pressable onPress={functionCombined}>
        <View style={styles.textView}>
          <Text
            style={[
              styles.english,
              { fontSize: fontSize * 0.75, color: getColor("LabelColor") },
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
                { fontSize: fontSize * 0.75, color: getColor("LabelColor") },
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
              { fontSize: fontSize * 0.75, color: getColor("LabelColor") },
            ]}
          >
            {item.ArabicTitle}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 5,
    borderWidth: 5,
  },
  textView: {
    flex: 1,
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

export default MenuItem;
