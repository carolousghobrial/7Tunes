import {
  View,
  Switch,
  StyleSheet,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import Languages from "../../constants/languages.js";
import { changePagination } from "../../stores/redux/settings.js";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function NotificationPermission() {
  const { height, width } = useWindowDimensions();
  const pagination = useSelector((state) => state.settings.pagination);
  const fontSize = useSelector((state) => state.settings.textFontSize);
  let flexDirection = "row";
  let difference = Object.keys(Languages.eng).filter(
    (x) => !Object.keys(Languages.ara).includes(x)
  );
  const dispatch = useDispatch();
  const toggleSwitch = () => dispatch(changePagination());

  return (
    <View style={[styles.container, { borderColor: getColor("PrimaryColor") }]}>
      <View style={[styles.switchView, { flexDirection: flexDirection }]}>
        <View style={styles.titleView}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize * 1.3, color: getColor("PrimaryColor") },
            ]}
          >
            NotificationPermission
          </Text>
          <Text
            style={[
              styles.title,
              { fontSize: fontSize / 1.8, color: getColor("PrimaryColor") },
            ]}
          >
            "Turn on"
          </Text>
        </View>
        <Pressable
          onPress={async () => {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Look at that notification",
                body: "I'm so proud of myself!",
              },
              trigger: { seconds: 5 },
            });
            token = (await Notifications.getExpoPushTokenAsync()).data;

            console.log(token);
          }}
        >
          <View style={styles.switch}>
            <Text>Send</Text>
          </View>
        </Pressable>
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
  },
  titleView: {
    flex: 2,
  },
  title: {
    fontFamily: "english-font",
  },
  description: {
    fontFamily: "english-font",
  },
  switchView: {
    margin: 5,
    padding: 5,
  },
  switch: {
    flex: 1,
    padding: 5,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textContainer: {
    marginHorizontal: 10,
  },
  textOn: {
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  textOff: {
    fontFamily: "english-font",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default NotificationPermission;
