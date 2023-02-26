import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  Text,
  LayoutAnimation,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import bookPaths from "../helpers/bookPathsHelpers";
import { useDispatch, useSelector } from "react-redux";

const _spacing = 10;
function BookScreen({ navigation, route }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);

  const data = bookPaths.morningDoxology["adam"];
  const [index, setIndex] = useState(0);
  const [howMcuhToScroll, sehowMcuhToScroll] = useState(0);
  // const [scrollDirection, setScrollDirection] = useState(null);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const flatListRef = useRef();
  const { height, width } = useWindowDimensions();

  const onViewableItemsChanged = React.useCallback((viewableItems) => {
    sehowMcuhToScroll(viewableItems.viewableItems.length - 1);
    // Use viewable items in state or as intended
  }, []); // any dependencies that require the function to be "redeclared"

  let Arabic = data.arabic.split("\n");
  let Coptic = data.coptic.split("\n");
  let English = data.english.split("\n");

  let ArabicCoptic = data.arabiccoptic.split("\n");
  let EnglishCoptic = data.englishcoptic.split("\n");

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;
    console.log(locationX);
    if (locationX < width / 2) {
      scrollUp();
    } else {
      scrollDown();
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };
  function renderItems(itemData) {
    const characters = itemData.item.split("");

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {characters.map((char, index) => (
          <View>
            <Text style={[styles.textStyle, { fontSize }]}>{char}</Text>
            <Text style={[styles.floatingText, { fontSize: fontSize / 2 }]}>
              {char}
            </Text>
          </View>
        ))}
      </View>
      // <Text style={[styles.textStyle, { fontSize }]}>{itemData.item}</Text>
    );
  }

  function scrollDown() {
    var newIndex = index + howMcuhToScroll;
    if (newIndex >= Coptic.length - 1) {
      return;
    }
    setIndex(newIndex);
  }
  function scrollUp() {
    var newIndex = index - howMcuhToScroll;
    if (newIndex <= 0) {
      return;
    }
    setIndex(newIndex);
  }

  useEffect(() => {
    flatListRef.current.scrollToIndex({ index, animated: true });
  }, [index]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={handlePress}>
        <FlatList
          ref={flatListRef}
          onViewableItemsChanged={onViewableItemsChanged}
          data={Coptic}
          contentContainerStyle={{ paddingLeft: _spacing }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItems}
          keyExtractor={(item, index) => {
            return item.charAt(2);
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "black",
  },
  textStyle: {
    fontFamily: "coptic-font",
    color: "white",
    justifyContent: "flex-start",
  },
  box: {
    flex: 1,
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
