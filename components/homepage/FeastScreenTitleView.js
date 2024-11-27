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

function FeastScreenTitleView({ yearClick, changeDate }) {
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
    try {
      setDate(
        new Date(
          currentSeason.gregorianYear,
          currentSeason.gregorianMonth,
          currentSeason.gregorianDayOfMonth
        )
      );
    } catch (error) {
      console.error("Error setting date:", error);
    }
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
    if (selectedDate && selectedDate !== date) {
      setShowPicker(Platform.OS === "ios");
      const updatedSeason = getCurrentSeasonByDate(
        selectedDate,
        timeTransition
      );
      dispatch(setSeason({ currentSeason: updatedSeason }));
      setDate(selectedDate);
    }
  };

  const togglePickerVisibility = () => {
    setShowPicker(!showPicker);
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
          styles.titleView,
          { backgroundColor: getColor("NavigationBarColor") },
        ]}
      >
        {isAndroid ? (
          <Pressable onPress={togglePickerVisibility}>
            <Text style={styles.openCalText}>Open Calendar</Text>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </Pressable>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleTimeChange}
            style={[styles.datePicker, { height: 40 }]} // Custom style added here
          />
        )}
      </View>

      {/* Year Selection */}
      <Pressable
        style={[
          styles.titleView,
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
  },
  liveContainer: {
    flex: 4,
    margin: 3,
    opacity: 0.8,
    borderColor: "black",
  },
  liveText: {
    fontFamily: "englishtitle-font",
    textAlign: "center",
    fontSize: 25,
  },
  titleView: {
    flex: 3,
    margin: 3,
    opacity: 0.8,
    borderColor: "black",
  },
  openCalText: {
    fontFamily: "englishtitle-font",
    textAlign: "center",
    fontSize: 23,
  },
  datePicker: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 0.9 }], // Shrink the picker slightly
    fontSize: 12, // Reducing the font size
  },
  yearText: {
    fontFamily: "englishtitle-font",
    textAlign: "center",
    fontSize: 25,
  },
});

export default FeastScreenTitleView;
