import React, { useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { getColor, getLanguageValue } from "../../helpers/SettingsHelpers.js";

function FloatingButton({ navigation }) {
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [buttonVisible, setbuttonVisible] = useState(true);

  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      // Add any additional logic you want to perform when the button is released
      setPosition({ x: position.x, y: position.y });
    },
  });
  function OpenBishopPage() {
    setbuttonVisible(false);
    navigation.push("BookScreen", {
      bookPath: "bishopEntrance",
      motherSource: "matins",
    });
  }
  const hexToRgba = (hex, opacity) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  const secondaryColorWithOpacity = hexToRgba(labelColor, 0.6); // Red color with 70% opacity

  return (
    <View>
      {buttonVisible && (
        <View style={[styles.container]}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              pan.getLayout(),
              styles.button,
              { backgroundColor: secondaryColorWithOpacity },
            ]}
          >
            <Pressable onPress={OpenBishopPage}>
              <Text style={{ color: NavigationBarColor }}>Bishop Arrived</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    right: 16,
    alignItems: "flex-end",
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingButton;
