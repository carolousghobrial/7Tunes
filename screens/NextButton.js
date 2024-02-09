import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Image,
  Animated,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Svg, { G, Circle } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";

function NextButton({ percentage, ScrollTo }) {
  const { width, height } = useWindowDimensions();
  const size = 128;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef();

  const isTablet = useSelector((state) => state.settings.isTablet);
  const fontSize = isTablet ? 30 : 20;
  let imageSize = 300;
  if (width > height) {
    // Landscape mode
    imageSize = 100;
  } else {
    // Portrait mode
    imageSize = 120;
  }
  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    animation(percentage);
  }, [percentage]);
  useEffect(() => {
    progressAnimation.addListener(
      (value) => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;

        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage]
    );
    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);
  const imageStyle = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  };
  const bookviewStyle = {
    width: width / 2.5,
    height: height / 3.5,
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <View style={[styles.container]}>
      <Svg width={size} height={size}>
        <G rotation="-180" origin={center}>
          <Circle
            stroke="#E6E7E8"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            ref={progressRef}
            stroke="#F4338F"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
          />
        </G>
      </Svg>
      <Pressable style={styles.button} activeOpacity={0.6} onPress={ScrollTo}>
        <AntDesign name="arrowright" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

export default NextButton;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.7,
    justifyContent: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 10,
    color: "#493d8a",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    backgroundColor: "#f4338f",
    borderRadius: 100,
    padding: 20,
  },
  desciption: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    paddingHorizontal: 64,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#493d8a",
    marginHorizontal: 8,
  },
});
