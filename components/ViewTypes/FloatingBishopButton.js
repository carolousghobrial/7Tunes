import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
} from "react-native";

function FloatingButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.button]}
      >
        <Text>Bishop Arrived</Text>
      </Animated.View>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingButton;
