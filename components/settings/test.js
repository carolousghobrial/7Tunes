// import React from "react";
// import { Text, StyleSheet } from "react-native";

// function Test() {
//   const text = "Hello World!";
//   const characters = text.split("");

//   return (
//     <Text style={styles.container}>
//       {characters.map((char, index) => (
//         <Text
//           key={index}
//           style={[
//             styles.text,
//             index % 2 === 0 ? styles.bold : styles.floatingText,
//           ]}
//         >
//           {char}
//         </Text>
//       ))}
//     </Text>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     margin: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 24,
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   italic: {
//     fontStyle: "italic",
//   },

//   floatingText: {
//     position: "absolute",
//     top: -20, // adjust the top position to make it float over the base letter
//     left: 10, // adjust the left position to align with the base letter
//     color: "red", // set the color of the floating letter
//     zIndex: 1, // set the zIndex to bring the floating letter to the top
//   },
// });

// export default Test;
import React from "react";
import { View, Text, StyleSheet } from "react-native";

function Test() {
  const text = "Tekmetouro Panou; > oumetouro `n`ene\\ ";
  const characters = text.split("");
  return (
    <View style={styles.container}>
      {characters.map((char, index) => (
        <View>
          <Text key={index} style={styles.text}>
            {char}
          </Text>
          <Text style={styles.floatingText}>{char}</Text>
        </View>
      ))}
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
