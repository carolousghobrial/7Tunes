import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );
}
export default LoadingScreen;
