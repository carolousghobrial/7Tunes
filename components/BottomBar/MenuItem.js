import {
  View,
  Switch,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
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
  const { width, height } = useWindowDimensions();

  let flexDirection = "row";

  if (width < height) {
    // Portrait mode
    flexDirection = "column";
  }

  var SelectedbackgroundColor = "transparent";
  function functionCombined() {
    scrollToKey(item.key);
  }
  if (item.key === HighlitedIndex) {
    SelectedbackgroundColor = getColor("pageBackgroundColor");
  }
  return (
    <Pressable
      style={[
        styles.container,
        {
          flexDirection: flexDirection,
          borderColor: getColor("PrimaryColor"),
          backgroundColor: SelectedbackgroundColor,
        },
      ]}
      onPress={functionCombined}
    >
      <View style={[styles.textView, { flexDirection: flexDirection }]}>
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
    textAlign: "right",
    justifyContent: "center",
    textAlign: "center",
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "right",
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
