import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

function ButtonView({ item, motherSource, flatListRef, viewData }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const { width, height } = useWindowDimensions();
  const flex = width > height ? "row" : "column";
  const itemVisible = item.Visible;
  const router = useRouter();

  const handlePress = () => {
    const ruleFunction = ButtonRules(
      item,
      motherSource,
      flatListRef,
      viewData,
      router
    )[item.Rule];

    ruleFunction && ruleFunction();
  };

  return (
    itemVisible !== "hide" && (
      <TouchableOpacity style={{ marginHorizontal: 70 }} onPress={handlePress}>
        <View style={[styles.bookView, { flexDirection: flex }]}>
          <Text style={[styles.text, { fontSize }]}>{item.English}</Text>
          <Text style={[styles.text, { fontSize }]}>{item.Arabic}</Text>
        </View>
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  bookView: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 30,
    backgroundColor: "#AA4A44",
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
