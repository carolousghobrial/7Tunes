import { View, Switch, Button, StyleSheet, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import {
  changeTodayPrayer,
  setSeason,
  setTimeTransition,
} from "../../stores/redux/settings.js";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";

function TodaysPrayer() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const dispatch = useDispatch();
  const navigationBarColor = getColor("NavigationBarColor");
  const primaryColor = getColor("PrimaryColor");
  const [time, setTime] = useState(new Date(timeTransition));
  const [showPicker, setShowPicker] = useState(false);

  const isAndroid = Platform.OS === "android"; // Simplified condition
  const toggleSwitch = () => dispatch(changeTodayPrayer());

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    if (time !== currentTime) {
      setShowPicker(Platform.OS === "ios");
      dispatch(setTimeTransition({ timeTransition: currentTime }));
      dispatch(setSeason({ currentSeason: setCurrentSeasonLive(currentTime) }));
      setTime(currentTime);
    }
  };

  const showTimePicker = () => setShowPicker(true);

  const TimePickerSection = () => (
    <View>
      <Text
        style={[
          styles.description,
          { fontSize: fontSize / 1.8, color: primaryColor },
        ]}
      >
        {getLanguageValue("setTimeTodayPrayer")}
      </Text>
      <Text style={[styles.text, { color: primaryColor }]}>
        Selected Time: {time.toLocaleTimeString()}
      </Text>
      <Button onPress={showTimePicker} title="Select time" />
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={isAndroid ? "default" : "inline"}
          minuteInterval={30}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: primaryColor,
          backgroundColor: navigationBarColor,
        },
      ]}
    >
      <View style={[styles.switchView]}>
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: primaryColor },
            ]}
          >
            {getLanguageValue("todayprayer")}
          </Text>
          <Text
            style={[
              styles.description,
              { fontSize: fontSize / 1.8, color: primaryColor },
            ]}
          >
            {getLanguageValue("todayprayerdescription")}
          </Text>
        </View>
        <View style={styles.switch}>
          <View style={styles.textContainer}>
            <Text style={todayPrayer ? styles.textOn : styles.textOff}>
              {todayPrayer ? "YES" : "NO"}
            </Text>
          </View>
          <Switch
            ios_backgroundColor={todayPrayer ? navigationBarColor : "#AA4A44"}
            value={todayPrayer}
            onValueChange={toggleSwitch}
            thumbColor="white"
          />
        </View>
      </View>

      <TimePickerSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  titleView: {
    flex: 2,
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontFamily: "english-font",
    color: "gray",
    fontStyle: "italic",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "english-font",
    margin: 5,
  },
  switchView: {
    margin: 5,
    padding: 5,
    flexDirection: "row", // Merged flexDirection into this style
  },
  switch: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
  },
  textOn: {
    color: "black",
    fontFamily: "english-font",
    fontWeight: "bold",
  },
  textOff: {
    color: "black",
    fontFamily: "english-font",
    fontWeight: "bold",
  },
});

export default TodaysPrayer;
