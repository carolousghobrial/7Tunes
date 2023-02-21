import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
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

const _spacing = 10;
function BookScreen({ navigation, route }) {
  const data = bookPaths.morningDoxology["adam"];
  const [index, setIndex] = useState(0);
  const [howMcuhToScroll, sehowMcuhToScroll] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(null);
  const previousOffset = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [offset, SetOffset] = React.useState(0);
  const flatListRef = useRef();
  //
  const onViewableItemsChanged = React.useCallback((viewableItems) => {
    sehowMcuhToScroll(viewableItems.viewableItems.length - 1);
    // Use viewable items in state or as intended
  }, []); // any dependencies that require the function to be "redeclared"

  let Arabic = data.arabic.split("\n");
  let Coptic = data.coptic.split("\n");
  let English = data.english.split("\n");
  let ArabicCoptic = data.arabiccoptic.split("\n");
  let EnglishCoptic = data.englishcoptic.split("\n");
  const [clickedSide, setClickedSide] = useState("");

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;

    if (locationX < screenWidth / 2) {
      setClickedSide("Left");
    } else {
      setClickedSide("Right");
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };
  function renderMealItem(itemData) {
    return <Text style={styles.textStyle}>{itemData.item}</Text>;
  }

  function scrollDown() {
    if (index === Coptic.length - 1) {
      return;
    }
    setIndex(index + howMcuhToScroll);
  }
  function scrollUp() {
    if (index === 0) {
      return;
    }
    setIndex(index - howMcuhToScroll);
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
          renderItem={renderMealItem}
          keyExtractor={(item, index) => {
            return index;
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
    margin: 5,
    padding: 5,
    color: "white",
    justifyContent: "space-around",
    textAlign: "justify",
    fontFamily: "coptic-font",
    fontSize: 35,
  },
  box: {
    flex: 1,
  },
});
