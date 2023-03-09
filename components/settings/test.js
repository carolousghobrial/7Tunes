import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../stores/redux/store";

import React from "react";
import { View, Button, StyleSheet } from "react-native";

function Test() {
  const currentSeason = useSelector((state) => state.settings.currentSeason);
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch({ type: "RESET_STATE" });
    persistor.purge();
  };
  return (
    <View>
      <Button title="Reset" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
    fontFamily: "coptic-font",
  },
  floatingText: {
    position: "absolute",
    top: -12, // adjust the top position to make it float over the base letter
    fontSize: 25,
    backgroundColor: "transparent",
    color: "red", // set the color of the floating letter
    zIndex: 1, // set the zIndex to bring the floating letter to the top
  },
});

export default Test;
