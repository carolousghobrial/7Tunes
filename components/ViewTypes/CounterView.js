import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";

// Counter component now takes in a target prop with a default value of 20
const Counter = ({ target, incrementBy }) => {
  // Initialize state to keep track of the counter
  const [count, setCount] = useState(0);

  // Function to increment the counter by 3
  const incrementCounter = () => {
    // Only increment if the current count is less than the target
    if (count + incrementBy <= target) {
      setCount((prevCount) => prevCount + incrementBy);
    } else {
      setCount(target);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the current count */}
      <Text style={styles.counterText}>Counter: {count}</Text>

      {/* Button to increment the counter */}
      <TouchableOpacity style={styles.button} onPress={incrementCounter}>
        <Text style={styles.buttonText}>Increment by {incrementBy}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  counterText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00796b", // Teal color for better contrast
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#00796b", // Teal background for buttons
    paddingVertical: 20,
    paddingHorizontal: 90,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Shadow effect for Android
  },
  buttonText: {
    color: "#ffffff", // White text color
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#d32f2f", // Red color for reset button
  },
});

export default Counter;
