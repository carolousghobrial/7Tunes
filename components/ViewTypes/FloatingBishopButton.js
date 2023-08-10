import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";

function FloatingButton({ navigation }) {
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
    navigation.navigate("BookScreen", {
      bookPath: "bishopEntrance",
      motherSource: "matins",
    });
  }
  return (
    <View>
      {buttonVisible && (
        <View style={styles.container}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[pan.getLayout(), styles.button]}
          >
            <Pressable onPress={OpenBishopPage}>
              <Text>Bishop Arrived</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingButton;
