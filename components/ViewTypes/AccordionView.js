import React, { memo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import SingleHymnAsView from "../../screens/SingleHymnAsView";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";

function AccordionView({
  mykey,
  flatListRef,
  item,
  motherSource,
  expanded,
  toggleAccordion,
}) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const labelColor = getColor("LabelColor");

  //   useEffect(() => {
  //     if (expanded && flatListRef.current) {
  //       const index = expanded.findIndex((item) => item === true);
  //       if (index != -1) {
  //         flatListRef.current.scrollToIndex({
  //           index: index,
  //           animated: true,
  //         });
  //       }
  //     }
  //   }, [expanded]);
  const getColorBySide = (side) => getColor(`${side}Color`);

  const getTextColor = (item) => {
    const sideColors = {
      North: "NorthColor",
      South: "SouthColor",
      Refrain: "RefrainColor",
      Priest: "PriestColor",
      Deacon: "DeaconColor",
      People: "PeopleColor",
      Reader: "ReaderColor",
      Title: "NorthColor",
      Neutral: mykey % 2 === 0 ? "NorthColor" : "SouthColor",
    };

    const side = sideColors[item.Side] || "NorthColor";
    return getColor(side);
  };

  const textStyle = {
    fontSize,
    flex: 1,
    lineHeight: fontSize * 1.1,
    margin: 5,
    fontFamily: "english-font", // Default font family for English text
    justifyContent: "flex-start",
    color: getTextColor(item),
  };

  const arabicStyle = {
    fontFamily: "arabic-font",
    lineHeight: fontSize * 1.6,
    textAlign: "right",
    writingDirection: "rtl",
  };

  const arabicCopticStyle = {
    fontFamily: "arabic-font",
    lineHeight: fontSize * 1.2,
    textAlign: "right",
    writingDirection: "rtl",
  };

  return (
    <View key={mykey} style={[styles.accordion, { borderColor: labelColor }]}>
      <TouchableOpacity
        onPress={() => toggleAccordion(mykey)}
        style={styles.titleContainer}
      >
        <View>
          <Text style={[styles.heading, textStyle]}>{item.English}</Text>
          <Text style={[styles.heading, textStyle]}>{item.Arabic}</Text>
        </View>

        <Text style={[styles.arrow, { color: labelColor }]}>
          {expanded[mykey] ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {expanded[mykey] && (
        <SingleHymnAsView
          path={item.Path}
          motherSource={motherSource}
          rule={item.Rule}
          englishTitle={item.English}
          arabicTitle={item.Arabic}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordion: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    flex: 1,
  },
  arrow: {
    fontSize: 20,
  },
});

export default memo(AccordionView);
