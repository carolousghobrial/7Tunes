import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import SettingsModal from "./SettingsModal";
function BottomBar({ navigation }) {
  const [settingsModalVisible, setsettingsModalVisible] = useState(false);
  let labelColor = getColor("LabelColor");
  let NavigationBarColor = getColor("NavigationBarColor");
  function closeModal() {
    setsettingsModalVisible(false);
  }
  return (
    <View>
      <SettingsModal visible={settingsModalVisible} closeModal={closeModal} />
      <View style={[styles.container, { backgroundColor: NavigationBarColor }]}>
        <Pressable style={styles.button} onPress={() => Alert.alert("HELLO")}>
          <Foundation name="clipboard-notes" size={24} color={labelColor} />
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialCommunityIcons
            name="table-of-contents"
            size={24}
            color={labelColor}
          />
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setsettingsModalVisible(true)}
        >
          <Icon name="ios-settings-outline" size={24} color={labelColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 35,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default BottomBar;
