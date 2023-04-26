import {
  View,
  Switch,
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  FlatList,
  Picker,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import Colors from "../../constants/colors.js";
import { useDispatch, useSelector } from "react-redux";
import { changeTextLanguage } from "../../stores/redux/settings.js";
import { useNavigation } from "@react-navigation/native";

function FeastScreenTitleView({ liveClicked, yearClick }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const timeTransition = useSelector((state) => state.settings.timeTransition);

  let flexDirection = "row";

  const [visible, setvisible] = useState(false); // initialize the selected year to the first year in the array
  const onYearChange = (year) => {
    setSelectedYear(year);
  };

  const { width, height } = useWindowDimensions();

  let textFlexDirection = "row";

  if (width < height) {
    // Portrait mode
    textFlexDirection = "column";
  }

  const fontSize = useSelector((state) => state.settings.textFontSize);

  return (
    <>
      <ImageBackground
        source={require("../../assets/images/titleBackground.png")}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Pressable style={styles.LiveContainer} onPress={liveClicked}>
            <Text style={styles.LiveText}>
              {getLanguageValue("setCurrentDate")}
            </Text>
          </Pressable>
          <Pressable style={styles.titleView} onPress={yearClick}>
            <Text style={styles.YearFont}> {getLanguageValue("setYear")}</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  LiveContainer: {
    flex: 7,
    margin: 3,
    borderWidth: 5,
    backgroundColor: "lightgray",
    borderColor: "black",
  },
  titleView: {
    flex: 3,
    margin: 3,
    backgroundColor: "lightgray",

    borderWidth: 5,
    borderColor: "black",
  },
  arabic: {
    fontFamily: "arabictitle-font",
    textAlign: "right",
    writingDirection: "rtl",
    justifyContent: "center",
    textAlign: "center",
  },
  LiveText: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 30,
  },
  YearFont: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 25,
  },
});

export default FeastScreenTitleView;
