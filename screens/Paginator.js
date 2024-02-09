import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Image,
  Animated,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Paginator({ data, scrollX }) {
  const { width, height } = useWindowDimensions();

  if (width > height) {
    // Landscape mode
    imageSize = 100;
  } else {
    // Portrait mode
    imageSize = 120;
  }

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
    <View style={[styles.container, { height: 64 }]}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
}

export default Paginator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
