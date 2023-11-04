import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { getLanguageValue } from "../../helpers/SettingsHelpers";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCurrentSeasonByDate } from "../../helpers/copticMonthsHelper";
import { setSeason } from "../../stores/redux/settings.js";

function FeastScreenTitleView({ liveClicked, yearClick, changeDate }) {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const [date, setDate] = useState(new Date());

  const { width, height } = useWindowDimensions();

  let textFlexDirection = "row";

  if (width < height) {
    // Portrait mode
    textFlexDirection = "column";
  }
  useEffect(() => {
    // Update the document title using the browser API
    try {
      var date = new Date(
        currentSeason.gregorianYear,
        currentSeason.gregorianMonth,
        currentSeason.gregorianDayOfMonth,
        0,
        0,
        0,
        0
      );
      setDate(date);
    } catch (error) {}
  }, []);
  const handleTimeChange = (event, selectedTime) => {
    const currentDate = selectedTime || date;
    if (date != currentDate) {
      const curSeason = getCurrentSeasonByDate(currentDate, timeTransition);
      dispatch(
        setSeason({
          currentSeason: curSeason,
        })
      );

      setDate(currentDate);
    }
  };
  const fontSize = useSelector((state) => state.settings.textFontSize);

  return (
    <ImageBackground
      source={require("../../assets/images/titleBackground.png")}
    >
      <View style={{ flexDirection: "row", width: "100%" }}>
        <Pressable style={styles.LiveContainer} onPress={liveClicked}>
          <Text style={styles.LiveText}>
            {getLanguageValue("setCurrentDate")}
          </Text>
        </Pressable>
        <Pressable style={styles.titleView} onPress={changeDate}>
          <DateTimePicker
            value={date}
            mode="date"
            style={styles.changeDate}
            is24Hour={false}
            display="default"
            minuteInterval={30}
            onChange={handleTimeChange}
          />
        </Pressable>
        <Pressable style={styles.titleView} onPress={yearClick}>
          <Text style={styles.YearFont}> {getLanguageValue("setYear")}</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  LiveContainer: {
    flex: 4,
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
  changeDate: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  YearFont: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 25,
  },
});

export default FeastScreenTitleView;
