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
  setSeason,
  setTimeTransition,
} from "../../stores/redux/settings.js";
import { setCurrentSeasonLive } from "../../helpers/copticMonthsHelper";

function TodaysPrayer() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const language = useSelector((state) => state.settings.appLanguage);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const timeTransition = useSelector((state) => state.settings.timeTransition);
  const dispatch = useDispatch();
  const [time, setTime] = useState(new Date(timeTransition));
  const [showPicker, setShowPicker] = useState(false);
  const isAndroid = Platform.OS === "ios" ? false : true;
  let flexDirection = "row";

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    if (time != currentTime) {
      setShowPicker(Platform.OS === "ios");
      dispatch(setTimeTransition({ timeTransition: currentTime }));
      dispatch(setSeason({ currentSeason: setCurrentSeasonLive(currentTime) }));

      setTime(currentTime);
    }
  };

  const showTimeTimePicker = () => {
    setShowPicker(true);
  };

  const hideTimeTimePicker = () => {
    setShowPicker(false);
  };

  const toggleSwitch = () => dispatch(changeTodayPrayer());
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: getColor("PrimaryColor"),
          backgroundColor: getColor("NavigationBarColor"),
        },
      ]}
    >
      <View style={[styles.switchView, { flexDirection: flexDirection }]}>
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
              todayPrayer ? Colors.NavigationBarColor : "#AA4A44"
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
            <Text
              style={[
                styles.description,
                {
                  fontSize: fontSize / 1.8,
                  color: getColor("PrimaryColor"),
                  flex: 7,
                },
              ]}
            >
              {getLanguageValue("setTimeTodayPrayer")}
            </Text>
            <Button onPress={showTimeTimePicker} title="Select time" />
            {showPicker && (
              <DateTimePicker
                value={time}
                style={{ flex: 1 }}
                mode="time"
                is24Hour={false}
                display="clock"
                minuteInterval={30}
                onChange={handleTimeChange}
              />
            )}
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.description,
                {
                  fontSize: fontSize / 1.8,
                  color: getColor("PrimaryColor"),
                  flex: 7,
                },
              ]}
            >
              {getLanguageValue("setTimeTodayPrayer")}
            </Text>
            <DateTimePicker
              value={time}
              mode="time"
              style={{ flex: 3 }}
              is24Hour={false}
              display="inline"
              minuteInterval={30}
              onChange={handleTimeChange}
            />
          </View>
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
  switchView: {
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
