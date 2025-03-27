import React, { useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

function ButtonView({
  item,
  motherSource,
  flatListRef,
  bookContents,
  setBookContents,
}) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const lastPress = useRef(null);

  if (item.Visible === "hide") return null;

  const handlePress = () => {
    const now = Date.now();
    if (lastPress.current && now - lastPress.current < 1000) return; // Prevent double-tap within 1s
    lastPress.current = now;

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 1000); // Re-enable after 1 second

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
    const updatedBookContents = [...bookContents];
    const index = updatedBookContents.findIndex(
      ({ part }) => part.Rule === "ThokTeTiGomScrollUpButtonRule"
    );

    if (index === -1) return;

    const itemCopy = { ...updatedBookContents[index] };
    const partCopy = { ...itemCopy.part };
    const oldCount = partCopy.Count;
    const newCount = oldCount + 1;

    const replaceCount = (text) =>
      text.replace(`( ${oldCount} )`, `( ${newCount} )`);

    partCopy.English = replaceCount(partCopy.English);
    partCopy.Arabic = replaceCount(partCopy.Arabic);
    partCopy.Count = newCount;

    if (newCount >= 12) partCopy.Visible = "hide";

    itemCopy.part = partCopy;
    updatedBookContents[index] = itemCopy;
    setBookContents(updatedBookContents);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.pressedButton,
        isDisabled && styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
    >
      <View style={[styles.bookView, { flexDirection: "column" }]}>
        <Text style={[styles.text, { fontSize }]}>{item.English}</Text>
        <Text style={[styles.text, { fontSize }]}>{item.Arabic}</Text>
      </View>
    </Pressable>
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
  pressedButton: {
    opacity: 0.7, // Slight fade when pressed
  },
  disabledButton: {
    opacity: 0.5, // Reduced opacity when disabled
  },
});

export default React.memo(ButtonView);
