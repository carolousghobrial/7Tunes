import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import {
  getCurrentSeasonByDate,
  setCurrentSeasonLive,
} from "../../helpers/copticMonthsHelper";
import { setSeason } from "../../stores/redux/settings";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";

function FeastScreenTitleView({ yearClick }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const isAndroid = Platform.OS === "android";

  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(
    new Date(
      currentSeason.gregorianYear,
      currentSeason.gregorianMonth,
      currentSeason.gregorianDayOfMonth
    )
  );

  const { width, height } = useWindowDimensions();
  const isPortrait = width < height;

  useEffect(() => {
    setDate(
      new Date(
        currentSeason.gregorianYear,
        currentSeason.gregorianMonth,
        currentSeason.gregorianDayOfMonth
      )
    );
  }, [currentSeason]);

  const liveClicked = () => {
    const updatedSeason = setCurrentSeasonLive(timeTransition);
    setDate(
      new Date(
        updatedSeason.gregorianYear,
        updatedSeason.gregorianMonth,
        updatedSeason.gregorianDayOfMonth
      )
    );
    dispatch(setSeason({ currentSeason: updatedSeason }));
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      setShowPicker(Platform.OS === "ios");
      const updatedSeason = getCurrentSeasonByDate(
        selectedDate,
        timeTransition
      );
      dispatch(setSeason({ currentSeason: updatedSeason }));
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Button */}
      <Pressable
        style={[
          styles.liveContainer,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
        onPress={liveClicked}
      >
        <Text style={[styles.liveText, { color: getColor("LabelColor") }]}>
          {getLanguageValue("setCurrentDate")}
        </Text>
      </Pressable>

      {/* Date Picker */}
      <View
        style={[
          styles.dateContainer,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
      >
        {isAndroid ? (
          <Pressable onPress={() => setShowPicker(!showPicker)}>
            <Text style={styles.openCalText}>
              {getLanguageValue("openCalendar")}
            </Text>
          </Pressable>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleTimeChange}
            style={styles.datePicker}
          />
        )}
        {isAndroid && showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>

      {/* Year Selection */}
      <Pressable
        style={[
          styles.yearContainer,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
        onPress={yearClick}
      >
        <Text style={[styles.yearText, { color: getColor("LabelColor") }]}>
          {getLanguageValue("setYear")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveContainer: {
    flex: 3,
    margin: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  liveText: {
    fontFamily: "englishtitle-font",
    fontSize: 18,
    textAlign: "center",
  },
  dateContainer: {
    flex: 4,
    margin: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  openCalText: {
    fontFamily: "englishtitle-font",
    fontSize: 20,
    textAlign: "center",
  },
  datePicker: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 0.9 }],
  },
  yearContainer: {
    flex: 3,
    margin: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  yearText: {
    fontFamily: "englishtitle-font",
    fontSize: 18,
    textAlign: "center",
  },
});

export default FeastScreenTitleView;
