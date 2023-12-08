import React from "react";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import {
  getCopticDateString,
  getCopticFastsFeasts,
} from "../../helpers/copticMonthsHelper";
import moment from "moment";
import { getCurrentSeason } from "../../helpers/copticMonthsHelper";
import "moment/locale/en-gb"; // import the locale for UK English
import { useDispatch, useSelector } from "react-redux";
import ButtonRules from "../../helpers/buttonRules";
import * as Haptics from "expo-haptics";

function ButtonView({ item, motherSource, flatListRef, viewData, navigation }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  const flex = width > height ? "row" : "column";
  const itemVisible = item.Visible;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const ruleFunction = ButtonRules(
      item,
      motherSource,
      flatListRef,
      viewData,
      navigation
    )[item.Rule];
    ruleFunction && ruleFunction();
  };

  return (
    <View>
      {itemVisible !== "hide" && (
        <Pressable onPress={handlePress}>
          <View style={[styles.bookView, { flexDirection: flex }]}>
            <Text style={[styles.text, { fontSize }]}>{item.English}</Text>
            <Text style={[styles.text, { fontSize }]}>{item.Arabic}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    backgroundColor: "#AA4A44",
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  text: {
    padding: 5,
    color: "black",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    textDecorationLine: "underline",
    justifyContent: "center",
  },
});

export default ButtonView;
