import { View, Switch, StyleSheet, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import { changeTodayPrayer } from "../../stores/redux/settings.js";

function TodaysPrayer() {
  const fontSize = useSelector((state) => state.settings.textFontSize);

  const todayPrayer = useSelector((state) => state.settings.todayPrayer);
  const dispatch = useDispatch();
  const toggleSwitch = () => dispatch(changeTodayPrayer());

  return (
    <View style={styles.container}>
      <View style={styles.switchView}>
        <View style={styles.titleView}>
          <Text style={[styles.title, { fontSize }]}>Today's Prayer</Text>
          <Text style={[styles.description, { fontSize: fontSize / 1.7 }]}>
            Today's Prayer options allows the application to automatically load
            the prayers/hymns said today rather than loading all the possible
            options
          </Text>
        </View>
        <View style={styles.switch}>
          <View style={styles.textContainer}>
            <Text
              style={
                todayPrayer
                  ? [styles.textOn, { fontSize }]
                  : [styles.textOff, { fontSize }]
              }
            >
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
