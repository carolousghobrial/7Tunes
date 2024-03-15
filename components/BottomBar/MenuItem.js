import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { getColor } from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors";
import { changeTextLanguage } from "../../stores/redux/settings";

const MenuItem = ({ item, index, HighlitedIndex, scrollToKey }) => {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  const highlightColor = getColor("pageBackgroundColor");

  const flexDirection = width < height ? "column" : "row";
  const isSelected = index === HighlitedIndex;
  const selectedBackgroundColor = isSelected ? highlightColor : "transparent";

  const handlePress = () => {
    scrollToKey(item.key);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          flexDirection,
          borderColor: getColor("PrimaryColor"),
          backgroundColor: selectedBackgroundColor,
        },
      ]}
      onPress={handlePress}
    >
      <View style={[styles.textView, { flexDirection }]}>
        <Text
          style={[
            styles.title,
            { fontSize: fontSize * 0.75, color: getColor("LabelColor") },
          ]}
        >
          {item.EnglishTitle}
        </Text>
      </View>
      {item.CopticTitle && (
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
      )}
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
    </TouchableOpacity>
  );
};

const styles = {
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
  title: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
  },
};

export default MenuItem;
