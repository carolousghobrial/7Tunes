import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

function ButtonView({ item, motherSource, flatListRef, viewData }) {
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
        const index = viewData.findIndex(
          (part) => part.EnglishTitle === "Pascha Praise"
        );

        flatListRef.current.scrollToIndex({
          index: index + 3,
          animated: false,
        });
        break;

      case "SkipShortLitanies":
        const skipIndex = viewData.findIndex(
          (part) => part.path === "RaisingOfIncenseAbsolution"
        );
        flatListRef.current.scrollToIndex({
          index: skipIndex - 7,
          animated: false,
        });
        break;

      case "SkipTasbehaCommemoration":
        const skipTasbehaIndex = viewData.findIndex(
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
