import { View, Switch, StyleSheet, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { getLanguageValue, getColor } from "../../helpers/SettingsHelpers";
import { changeTodayPrayer } from "../../stores/redux/settings.js";

function TodaysPrayer() {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const dispatch = useDispatch();
  const toggleSwitch = () => dispatch(changeTodayPrayer());
  return (
    <View style={styles.container}>
      <View style={styles.switchView}>
        <View style={styles.titleView}>
          <Text style={[styles.title]}>{getLanguageValue("todayprayer")}</Text>
          <Text style={[styles.description]}>
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
