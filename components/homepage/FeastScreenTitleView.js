import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCurrentSeasonByDate } from "../../helpers/copticMonthsHelper";
import { setSeason } from "../../stores/redux/settings.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import {
  setCurrentSeasonLive,
  setCurrentSeasonByKey,
} from "../../helpers/copticMonthsHelper";

function FeastScreenTitleView({ yearClick, changeDate }) {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const dispatch = useDispatch();
  const isAndroid = Platform.OS === "ios" ? false : true;
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const [date, setDate] = useState(
    new Date(
      currentSeason.gregorianYear,
      currentSeason.gregorianMonth,
      currentSeason.gregorianDayOfMonth,
      0,
      0,
      0,
      0
    )
  );
  function liveClicked() {
    const currSeason = setCurrentSeasonLive(timeTransition);
    setDate(
      new Date(
        currSeason.gregorianYear,
        currSeason.gregorianMonth,
        currSeason.gregorianDayOfMonth,
        0,
        0,
        0,
        0
      )
    );
    dispatch(setSeason({ currentSeason: currSeason }));
  }
  const { width, height } = useWindowDimensions();

  let textFlexDirection = "row";
  const showTimeTimePicker = () => {
    setShowPicker(true);
  };

  const hideTimeTimePicker = () => {
    setShowPicker(false);
  };
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
      setShowPicker(Platform.OS === "ios");
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
    <View
      style={{
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Pressable
        style={[
          styles.LiveContainer,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
        onPress={liveClicked}
      >
        <Text style={[styles.LiveText, { color: getColor("LabelColor") }]}>
          {getLanguageValue("setCurrentDate")}
        </Text>
      </Pressable>
      <View
        style={[
          styles.titleView,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
      >
        {isAndroid ? (
          <View>
            <Pressable onPress={showTimeTimePicker}>
              <Text style={styles.openCal}>Open Calander</Text>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  style={styles.changeDate}
                  is24Hour={false}
                  display="default"
                  minuteInterval={30}
                  onChange={handleTimeChange}
                />
              )}
            </Pressable>
          </View>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            style={styles.changeDate}
            is24Hour={false}
            display="default"
            minuteInterval={30}
            onChange={handleTimeChange}
          />
        )}
      </View>
      <Pressable
        style={[
          styles.titleView,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
        onPress={yearClick}
      >
        <Text style={[styles.YearFont, { color: getColor("LabelColor") }]}>
          {getLanguageValue("setYear")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  LiveContainer: {
    flex: 4,
    margin: 3,
    opacity: 0.8,

    backgroundColor: "lightgray",
    borderColor: "black",
  },
  titleView: {
    flex: 3,
    opacity: 0.8,
    margin: 3,
    backgroundColor: "lightgray",
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
    fontSize: 25,
  },
  openCal: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 23,
  },
  changeDate: {
    justifyContent: "center",
    textAlign: "center",
    flex: 1,
    alignContent: "center",
    width: "100%",
    height: "100%",
  },
  YearFont: {
    fontFamily: "englishtitle-font",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 25,
  },
});

export default FeastScreenTitleView;
