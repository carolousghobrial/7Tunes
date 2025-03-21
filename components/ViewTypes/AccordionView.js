import React, { useState, useCallback, useMemo, memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import SingleHymnAsView from "../../screens/SingleHymnAsView";
import { getColor } from "../../helpers/SettingsHelpers";

const AccordionView = ({ mykey, item, motherSource }) => {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const labelColor = getColor("LabelColor");

  const [expanded, setExpanded] = useState({});

  const toggleAccordion = useCallback((index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const getTextColor = (side) => {
    if (side === "Neutral")
      return getColor(mykey % 2 === 0 ? "NorthColor" : "SouthColor");
    return getColor(
      {
        North: "NorthColor",
        South: "SouthColor",
        Refrain: "RefrainColor",
        Priest: "PriestColor",
        Deacon: "DeaconColor",
        People: "PeopleColor",
        Reader: "ReaderColor",
      }[side] || "NorthColor"
    );
  };

  const textColor = getTextColor(item.Side);

  const textStyles = useMemo(
    () =>
      StyleSheet.create({
        default: {
          fontSize,
          lineHeight: fontSize * 1.1,
          margin: 5,
          flex: 1,
          color: textColor,
          fontFamily: "english-font",
        },
        arabic: {
          fontSize,
          lineHeight: fontSize * 1.6,
          margin: 5,
          flex: 1,
          color: textColor,
          fontFamily: "arabic-font",
          textAlign: "right",
          writingDirection: "rtl",
        },
        arabicCoptic: {
          fontSize,
          lineHeight: fontSize * 1.2,
          margin: 5,
          flex: 1,
          color: textColor,
          fontFamily: "arabic-font",
          textAlign: "right",
          writingDirection: "rtl",
        },
      }),
    [fontSize, textColor]
  );

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
