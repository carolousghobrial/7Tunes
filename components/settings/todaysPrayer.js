import {
  View,
  Switch,
  Button,
  StyleSheet,
  Text,
  Image,
  Platform,
  Pressable,
} from "react-native";
import moment from "moment";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import {
  changeTodayPrayer,
  setTimeTransition,
} from "../../stores/redux/settings.js";

function TodaysPrayer() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const dispatch = useDispatch();
  const [time, setTime] = useState(new Date(timeTransition));
  const [showPicker, setShowPicker] = useState(false);
  const isAndroid = Platform.OS === "ios" ? false : true;
  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(Platform.OS === "ios");
    dispatch(setTimeTransition({ timeTransition: currentTime }));
    setTime(currentTime);
  };

  const showTimeTimePicker = () => {
    setShowPicker(true);
  };

  const hideTimeTimePicker = () => {
    setShowPicker(false);
  };

  const toggleSwitch = () => dispatch(changeTodayPrayer());
  return (
    <View style={[styles.container, { borderColor: getColor("PrimaryColor") }]}>
      <View style={styles.switchView}>
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("todayprayer")}
          </Text>
          <Text
            style={[
              styles.description,
              { fontSize: fontSize / 1.8, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("todayprayerdescription")}
          </Text>
        </View>
        <View style={styles.switch}>
          <View style={styles.textContainer}>
            <Text style={todayPrayer ? [styles.textOn] : [styles.textOff]}>
              {todayPrayer ? "YES" : "NO"}
            </Text>
          </View>
          <Switch
            ios_backgroundColor={
              todayPrayer ? Colors.NavigationBarColor : "red"
            }
            value={todayPrayer}
            onValueChange={toggleSwitch}
            thumbColor="white"
          />
        </View>
      </View>
      <View>
        {isAndroid ? (
          <View>
            <Button onPress={showTimeTimePicker} title="Select time" />
            {showPicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display="clock"
                minuteInterval={30}
                onChange={handleTimeChange}
              />
            )}
          </View>
        ) : (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display="clock"
            minuteInterval={30}
            onChange={handleTimeChange}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.2)",

    borderWidth: 5,
  },
  titleView: {
    flex: 2,
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontFamily: "english-font",
    textAlign: "justify",
    color: "gray",
    fontStyle: "italic",
  },
  switchView: {
    flexDirection: "row",
    margin: 5,
    padding: 5,
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
