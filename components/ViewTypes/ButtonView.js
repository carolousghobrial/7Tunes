import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

function ButtonView({
  item,
  motherSource,
  flatListRef,
  bookContents,
  setBookContents,
}) {
  const fontSize = useSelector((state) => state.settings.textFontSize); // Access font size
  const router = useRouter();

  if (item.Visible === "hide") return null;

  const handlePress = () => {
    switch (item.Rule) {
      case "OpenTheotokiaButtonRule":
      case "OpenDoxologiesButtonRule":
      case "OpenPalmSundayProcessionButtonRule":
      case "OpenPageButtonRule":
        router.push(
          {
            pathname: "/bookscreen/BookScreen",
            params: {
              bookPath: item.Path,
              englishTitle: item.English,
              arabicTitle: item.Arabic,
              motherSource: item.mother,
              Switch: item.Switch,
            },
          },
          undefined,
          { shallow: true }
        );
        break;

      case "OpenNewPageButtonRule":
        router.replace({
          pathname: "/bookscreen/BookScreen",
          params: {
            bookPath: item.Path,
            englishTitle: item.English,
            arabicTitle: item.Arabic,
            motherSource: item.mother,
            Switch: item.Switch,
          },
        });
        break;

      case "OpenSinglePageButtonRule":
        router.push({
          pathname: "/bookscreen/ViewSingleHymn",
          params: {
            path: item.Path,
            motherSource,
            rule: item.Rule,
            englishTitle: item.English,
            arabicTitle: item.Arabic,
          },
        });
        break;

      case "ThokTeTiGomScrollUpButtonRule":
        const index = bookContents.findIndex(
          (part) => part.EnglishTitle === "Pascha Praise"
        );

        updateItemCount(item);

        flatListRef.current.scrollToIndex({
          index: index + 3,
          animated: false,
        });
        break;

      case "SkipShortLitanies":
        const skipIndex = bookContents.findIndex(
          (part) => part.path === "RaisingOfIncenseAbsolution"
        );
        flatListRef.current.scrollToIndex({
          index: skipIndex - 7,
          animated: false,
        });
        break;

      case "SkipTasbehaCommemoration":
        const skipTasbehaIndex = bookContents.findIndex(
          (part) => part.part.Path === "doxologies"
        );
        flatListRef.current.scrollToIndex({
          index: skipTasbehaIndex - 4,
          animated: false,
        });
        break;

      case "PopPage":
        router.back();
        break;

      default:
        console.warn("No matching rule found for this button!");
        break;
    }
  };
  const updateItemCount = (item) => {
    // Create a copy of the bookContents array to avoid mutating the original array
    const updatedBookContents = [...bookContents];

    // Find the item that matches the rule (you could also use .map or .find depending on your use case)
    const index = updatedBookContents.findIndex(
      ({ part }) => part.Rule === "ThokTeTiGomScrollUpButtonRule"
    );

    if (index === -1) {
      console.log("Item not found");
      return; // If no item is found, exit early
    }

    // Deep copy the item to avoid modifying original references
    const itemCopy = { ...updatedBookContents[index] }; // Shallow copy
    const partCopy = { ...itemCopy.part }; // Shallow copy of part object
    // Ensure Count is a valid number before incrementing
    const oldCount = partCopy.Count; // Default to 0 if Count is NaN
    const newCount = oldCount + 1; // Increment count by 1

    console.log("Old count:", oldCount);
    console.log("New count:", newCount);

    // Helper function to replace old count with new count in text
    const replaceCount = (text) =>
      text.replace(`( ${oldCount} )`, `( ${newCount} )`);

    // Modify the English and Arabic properties in the partCopy
    partCopy.English = replaceCount(partCopy.English);
    partCopy.Arabic = replaceCount(partCopy.Arabic);
    partCopy.Count = newCount;
    console.log("Updated English:", partCopy.English);
    console.log("Updated Arabic:", partCopy.Arabic);

    // Hide item if count is greater than or equal to 12
    if (newCount >= 12) partCopy.Visible = "hide";

    // Update the item with the modified partCopy
    itemCopy.part = partCopy;

    // Update the modified item back into the updated array at the correct index
    updatedBookContents[index] = itemCopy;

    // Update the state with the modified array
    setBookContents(updatedBookContents);
  };

  return (
    <TouchableOpacity style={[styles.buttonContainer]} onPress={handlePress}>
      <View style={[styles.bookView, { flexDirection: "column" }]}>
        <Text style={[styles.text, { fontSize }]}>{item.English}</Text>
        <Text style={[styles.text, { fontSize }]}>{item.Arabic}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 70,
    marginVertical: 10,
  },
  bookView: {
    borderRadius: 30,
    backgroundColor: "#AA4A44",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    color: "white",
    flex: 1,
    fontSize: 15,
    fontFamily: "english-font",
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  disabledButton: {
    opacity: 0.5, // Reduce opacity when disabled
  },
});

export default React.memo(ButtonView);
