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
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/colors.js";
import Languages from "../../constants/languages.js";
import { changeNotifications } from "../../stores/redux/settings.js";
import * as Notifications from "expo-notifications";
import moment from "moment";
//scheduleNotification("TEST", "TESTING", new moment().add(2, "seconds"));

function NotificationPermission() {
  const { height, width } = useWindowDimensions();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const notifications = useSelector((state) => state.settings.notifications);
  const fontSize = useSelector((state) => state.settings.textFontSize);

  let flexDirection = "row";

  const dispatch = useDispatch();
  const toggleSwitch = () => {
    dispatch(changeNotifications());
  };
  const scheduleNotification = async (title, body, date) => {
    // Convert the date to milliseconds since Unix epoch
    const trigger = new Date().getTime();

    // Define the notification
    const notificationContent = {
      title: title,
      body: body,
      sound: "default",
      vibrate: true,
    };

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: { date: trigger },
    });
  };

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("TAPPED");
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
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
            {getLanguageValue("NotificationPermission")}
          </Text>
          <Text
            style={[
              styles.description,
              { fontSize: fontSize / 1.8, color: getColor("PrimaryColor") },
            ]}
          >
            {getLanguageValue("NotificationPermissionDescription")}
          </Text>
        </View>
      </View>
      <View style={styles.switch}>
        <View style={styles.textContainer}>
          <Text
            style={[
              notifications ? [styles.textOn] : [styles.textOff],
              { color: getColor("PrimaryColor") },
            ]}
          >
            {notifications ? "Yes" : "No"}
          </Text>
        </View>
        <Switch
          trackColor={{
            false: getColor("NavigationBarColor"),
            true: getColor("SecondaryColor"),
          }}
          ios_backgroundColor={
            notifications
              ? getColor("SecondaryColor")
              : getColor("NavigationBarColor")
          }
          value={notifications}
          onValueChange={toggleSwitch}
          thumbColor="white"
        />
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
