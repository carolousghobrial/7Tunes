import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  FlatList,
  Animated,
  Dimensions,
  Button,
  Pressable,
  StatusBar,
} from "react-native";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import BookView from "../components/homepage/bookView";
import TopBoxView from "../components/homepage/topBoxView";
import homescreenPaths from "../helpers/homescreenPaths";
import bookPaths from "../helpers/bookPathsHelpers";
import { useDispatch, useSelector } from "react-redux";
import BaseView from "../components/ViewTypes/BaseView";
import MelodyView from "../components/ViewTypes/MelodyView";
import TitleView from "../components/ViewTypes/TitleView";
import RitualView from "../components/ViewTypes/RitualView";
import ButtonView from "../components/ViewTypes/ButtonView";
import ExpanderView from "../components/ViewTypes/ExpanderView";
import CustomHeader from "../components/ViewTypes/CustomHeader";
import { Updates } from "expo";

import BottomBar from "../components/BottomBar/BottomBar";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../viewModel/getFullViewModel";
const _spacing = 10;
function BookScreen({ navigation, route }) {
  const fontSize = useSelector((state) => state.settings.textFontSize);
  const flatListRef = useRef();
  var pageBackgroundColor = getColor("pageBackgroundColor");

  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const [index, setIndex] = useState(0);
  const [howMcuhToScroll, sehowMcuhToScroll] = useState(0);
  const [newIndex, setnewIndex] = useState(null);
  const [scrollToIndex, setscrollToIndex] = useState(null);

  const motherSource = route.params.motherSource;
  const bookPath = route.params.bookPath;

  const [data, menuData] = getFullViewModel(
    motherSource,
    homescreenPaths[bookPath]
  );
  const [englishTitle, setenglishTitle] = useState(data[0].part.english);
  const [copticTitle, setcopticTitle] = useState(data[0].part.coptic);
  const [arabicTitle, setarabicTitle] = useState(data[0].part.arabic);
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const { WIDTH, HEIGHT } = useWindowDimensions();

  // if (width > height) {
  //   // Landscape mode
  // } else {
  //   // Portrait mode
  // }

  // const handleScroll = (event) => {
  //   const position = event.nativeEvent;
  //   console.log(position);
  // };
  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    try {
      if (viewableItems[0].item.EnglishTitle != englishTitle) {
        setenglishTitle(viewableItems[0].item.EnglishTitle);
        setcopticTitle(viewableItems[0].item.CopticTitle);
        setarabicTitle(viewableItems[0].item.ArabicTitle);
      }
      setnewIndex(viewableItems[0].key);

      sehowMcuhToScroll(viewableItems.length - 1);
    } catch (error) {}

    // Use viewable items in state or as intended
  }, []); // any dependencies that require the function to be "redeclared"

  //   // update state with the new visibleIndexes array
  //   setVisibleIndexes(visibleIndexes);
  // };
  function scrollDown() {
    var scrollnewIndex = index + howMcuhToScroll;
    if (scrollnewIndex >= data.length - 1) {
      return;
    }
    setIndex(scrollnewIndex);
  }
  function scrollUp() {
    var scrollnewIndex = index - howMcuhToScroll;
    if (scrollnewIndex <= 0) {
      scrollnewIndex = 0;
    }
    setIndex(scrollnewIndex);
  }
  async function scrollToKey(key) {
    //await Updates.reloadAsync();

    setenglishTitle(data[key].EnglishTitle);
    setcopticTitle(data[key].CopticTitle);
    setarabicTitle(data[key].ArabicTitle);
    flatListRef.current.scrollToIndex({
      index: key,
      animated: false,
    });
  }

  useEffect(() => {
    StatusBar.setHidden(NavbarVisibility);
    navigation.setOptions({
      headerShown: NavbarVisibility,
      header: () => (
        <CustomHeader
          navigation={navigation}
          english={englishTitle}
          coptic={copticTitle}
          arabic={arabicTitle}
        />
      ),
    });
  }, [NavbarVisibility]);
  function hideHeader() {
    setNavbarVisibility(!NavbarVisibility);
  }

  function renderItems({ item }) {
    let content = {};
    switch (item.part.Type) {
      case "Base":
        content = <BaseView item={item.part}></BaseView>;

        break;
      case "Melody":
        content = <MelodyView item={item.part}></MelodyView>;

        break;
      case "Title":
        content = <TitleView item={item.part}></TitleView>;

        break;
      case "Ritual":
        content = <RitualView item={item.part}></RitualView>;

        break;
      case "Button":
        content = (
          <ButtonView
            item={item.part}
            motherSource={motherSource}
            navigation={navigation}
          ></ButtonView>
        );
        break;
      default:
        return <Text>Default</Text>;
        break;
    }
    return <Pressable onPress={hideHeader}>{content}</Pressable>;
  }

  return (
    // <GestureRecognizer
    //   style={{ flex: 1 }}
    //   onSwipeUp={scrollDown}
    //   onSwipeDown={scrollUp}
    // >
    <View style={[styles.container, { backgroundColor: pageBackgroundColor }]}>
      <FlatList
        ref={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        data={data}
        onScrollToIndexFailed={(error) => {
          flatListRef.current.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: false,
          });
          setTimeout(() => {
            if (flatListRef !== null) {
              flatListRef.current.scrollToIndex({
                index: error.index,
                animated: false,
              });
            }
          }, 10);
        }}
        snapToAlignment="start"
        decelerationRate={"fast"}
        // onScroll={({ nativeEvent }) => {
        //   const { contentOffset } = nativeEvent;
        //   const index = Math.round(contentOffset.y / 100); // Calculate the current index based on the snap interval
        //   const snapInterval = index === 0 ? 100 : index * 150; // Adjust the snap interval based on the current index
        //   flatListRef.current.scrollToIndex({
        //     index,
        //     viewPosition: 0.5,
        //   }); // Scroll to the current index with the updated snap interval
        // }}
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item, index) => {
          return item.key;
        }}
      />

      {NavbarVisibility && (
        <BottomBar
          navigation={navigation}
          dataArray={menuData}
          initialKey={newIndex}
          scrollToKey={scrollToKey}
        />
      )}
    </View>
    // </GestureRecognizer>
  );
}

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
