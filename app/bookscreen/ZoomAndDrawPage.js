import React, { useState, useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  Pressable,
  View,
  Text,
  PanResponder,
} from "react-native";
import {
  PinchGestureHandler,
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { getMain } from "../../viewModel/getFullViewModel.js";
import BaseView from "../../components/ViewTypes/BaseView.js";
import MelodyView from "../../components/ViewTypes/MelodyView.js";
import TitleView from "../../components/ViewTypes/TitleView.js";
import RitualView from "../../components/ViewTypes/RitualView.js";
import MainTitleView from "../../components/ViewTypes/MainTitleView.js";
import { useLocalSearchParams, useRouter } from "expo-router";

const ZoomAndDrawPage = () => {
  const router = useRouter();
  const { path, rule } = useLocalSearchParams();
  const data = getMain(path, "index", false, rule, 0)[0];

  // Scale and position variables
  const scale = useRef(new Animated.Value(1)).current; // Scale factor for zoom
  const translateX = useRef(new Animated.Value(0)).current; // X position for dragging
  const translateY = useRef(new Animated.Value(0)).current; // Y position for dragging
  const lastScale = useRef(1); // Last scale value after pinch
  const [isPinching, setIsPinching] = useState(false);

  // Drawing State
  const [pathPoints, setPathPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false); // Flag to toggle drawing mode

  // Pinch Gesture Events
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: false }
  );

  const onPinchGestureStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      lastScale.current *= nativeEvent.scale; // Update scale after pinch ends
      scale.setValue(lastScale.current); // Update scale value
      setIsPinching(false);
    } else if (
      nativeEvent.state === State.BEGAN ||
      nativeEvent.state === State.CHANGED
    ) {
      setIsPinching(true);
    }
  };

  // Pan Gesture Events (for dragging)
  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false }
  );

  // PanResponder for drawing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawing, // Only start if drawing is enabled
      onMoveShouldSetPanResponder: () => isDrawing, // Only move if drawing is enabled
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setPathPoints([{ x: locationX, y: locationY }]); // Add starting point
      },
      onPanResponderMove: (e) => {
        if (!isDrawing) return;
        const { locationX, locationY } = e.nativeEvent;
        setPathPoints((prevPoints) => [
          ...prevPoints,
          { x: locationX, y: locationY },
        ]); // Add new points as user moves their finger
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // Prevent zooming too far in/out
  const scaledStyle = {
    transform: [
      { translateX: translateX },
      { translateY: translateY },
      { scale: scale },
    ],
  };

  // Render the marker-like drawing
  const renderDrawing = () => {
    return pathPoints.map((point, index) => (
      <View
        key={index}
        style={[
          styles.drawPoint,
          {
            left: point.x,
            top: point.y,
            transform: [{ scale }],
          },
        ]}
      />
    ));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Pinch Gesture Wrapper */}
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchGestureStateChange}
      >
        <Animated.View style={{ flex: 1 }}>
          {/* Pan Gesture Wrapper around FlatList */}
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={() => {}}
          >
            <Animated.View style={scaledStyle}>
              {/* FlatList for rendering content */}
              <FlatList
                data={data} // Same data as in BookScreen
                renderItem={({ item }) => {
                  const viewTypeMap = {
                    Base: <BaseView item={item.part} mykey={item.key} />,
                    Melody: <MelodyView item={item.part} />,
                    Title: <TitleView item={item.part} />,
                    Ritual: <RitualView item={item.part} />,
                    MainTitle: <MainTitleView item={item.part} />,
                  };
                  return (
                    <Pressable
                      style={{
                        marginRight: Platform.OS === "android" ? 10 : 0, // Ensure padding for Android
                      }}
                      onPress={() => {
                        router.push({
                          pathname: "/bookscreen/modal",
                          params: { title: item.part.English },
                        });
                      }}
                    >
                      {viewTypeMap[item.part.Type]}
                    </Pressable>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {/* Drawing overlay */}
      <View style={styles.drawingContainer} {...panResponder.panHandlers}>
        {renderDrawing()}
      </View>

      {/* Marker button */}
      <Pressable
        style={styles.markerButton}
        onPress={() => setIsDrawing((prev) => !prev)} // Toggle drawing mode
      >
        <Text style={styles.buttonText}>
          {isDrawing ? "Stop Drawing" : "Start Drawing"}
        </Text>
      </Pressable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    margin: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
  },
  drawingContainer: {
    ...StyleSheet.absoluteFillObject, // Position the drawing container over everything
    zIndex: 1, // Make sure it's on top of the FlatList
  },
  drawPoint: {
    position: "absolute",
    width: 20, // Larger size for a marker-like effect
    height: 20, // Larger size for a marker-like effect
    backgroundColor: "black", // Black marker color
    borderRadius: 10, // Round marker shape
    opacity: 0.8, // Slight transparency for marker
  },
  markerButton: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ZoomAndDrawPage;
