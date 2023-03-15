import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ActivityIndicator size="large" color="white" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );
}
export default LoadingScreen;
