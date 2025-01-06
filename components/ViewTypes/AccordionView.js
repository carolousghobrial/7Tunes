import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import SingleHymnAsView from "../../screens/SingleHymnAsView";
import { getColor } from "../../helpers/SettingsHelpers";

const AccordionView = ({ mykey, item, motherSource }) => {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const labelColor = getColor("LabelColor");
  const [expanded, setExpanded] = useState([]);
  const toggleAccordion = useCallback((index) => {
    setExpanded((prevExpanded) => {
      const updatedExpanded = [...prevExpanded];
      updatedExpanded[index] = !updatedExpanded[index];
      return updatedExpanded;
    });
  }, []);
  const getTextColor = (side) => {
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
    return getColor(sideColors[side] || "NorthColor");
  };

  const baseTextStyle = {
    fontSize,
    lineHeight: fontSize * 1.1,
    margin: 5,
    flex: 1,
    color: getTextColor(item.Side),
  };

  const textStyles = StyleSheet.create({
    default: {
      ...baseTextStyle,
      fontFamily: "english-font",
      justifyContent: "flex-start",
    },
    arabic: {
      ...baseTextStyle,
      fontFamily: "arabic-font",
      lineHeight: fontSize * 1.6,
      textAlign: "right",
      writingDirection: "rtl",
    },
    arabicCoptic: {
      ...baseTextStyle,
      fontFamily: "arabic-font",
      lineHeight: fontSize * 1.2,
      textAlign: "right",
      writingDirection: "rtl",
    },
  });

  return (
    <View key={mykey} style={[styles.accordion, { borderColor: labelColor }]}>
      <TouchableOpacity
        onPress={() => toggleAccordion(mykey)}
        style={styles.titleContainer}
      >
        <View>
          <Text style={textStyles.default}>{item.English}</Text>
          <Text style={textStyles.default}>{item.Arabic}</Text>
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
};

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
  arrow: {
    fontSize: 20,
  },
});

export default memo(AccordionView);
