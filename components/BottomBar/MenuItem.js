import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { getColor } from "../../helpers/SettingsHelpers";

const MenuItem = ({ item, index, HighlitedIndex, scrollToKey }) => {
  const fontSize = useSelector((state) => state.settings.textFontSize);

  const flexDirection = "column";
  const isSelected = index === HighlitedIndex;
  const selectedBackgroundColor = isSelected
    ? getColor("pageBackgroundColor")
    : "transparent";
  const primaryColor = getColor("PrimaryColor");

  const handlePress = () => {
    scrollToKey(item.key);
  };

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection,
          borderColor: primaryColor,
          backgroundColor: selectedBackgroundColor,
        },
      ]}
    >
      <View style={[styles.textView, { flexDirection }]}>
        <Text
          style={[
            styles.title,
            { fontSize: fontSize * 0.55, color: primaryColor },
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
              { fontSize: fontSize * 0.75, color: primaryColor },
            ]}
          >
            {item.CopticTitle}
          </Text>
        </View>
      )}
      {item.ArabicTitle && (
        <View style={styles.textView}>
          <Text
            style={[
              styles.arabic,
              { fontSize: fontSize * 0.75, color: primaryColor },
            ]}
          >
            {item.ArabicTitle}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 2,
    borderWidth: 5,
  },
  textView: {
    flex: 1,
    margin: 2,
    justifyContent: "center",
  },
  coptic: {
    fontFamily: "coptic-font",
    textAlign: "center",
    justifyContent: "center",
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "center",
    writingDirection: "rtl",
    justifyContent: "center",
  },
  title: {
    fontFamily: "englishtitle-font",
    textAlign: "center",
    justifyContent: "center",
  },
};

export default MenuItem;
