import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  FlatList,
  Animated,
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
  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const [index, setIndex] = useState(0);
  const [howMcuhToScroll, sehowMcuhToScroll] = useState(0);
  const [newIndex, setnewIndex] = useState(0);
  const [englishTitle, setenglishTitle] = useState("");
  const [copticTitle, setcopticTitle] = useState("");
  const [arabicTitle, setarabicTitle] = useState("");
  const { width, height } = useWindowDimensions();

  if (width > height) {
    // Landscape mode
  } else {
    // Portrait mode
  }
  const flatListRef = useRef();

  var pageBackgroundColor = getColor("pageBackgroundColor");

  const motherSource = route.params.bookPath;
  const [data, menuData] = getFullViewModel(homescreenPaths[motherSource]);

  // const handleScroll = (event) => {
  //   const position = event.nativeEvent;
  //   console.log(position);
  // };
  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    try {
      console.log(viewableItems[0].key);
      setnewIndex(viewableItems[0].key);

      sehowMcuhToScroll(viewableItems.length - 1);
    } catch (error) {}

    // Use viewable items in state or as intended
  }, []); // any dependencies that require the function to be "redeclared"

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
  function scrollToKey(key) {
    flatListRef.current.scrollToIndex({ index: key, animated: false });
    // setscrollToIndex(key);
  }

  useEffect(() => {
    StatusBar.setHidden(NavbarVisibility);
    if (index != newIndex) {
      setIndex(newIndex);
      var item = data.find((item) => item.key === index);
      setenglishTitle(item.EnglishTitle);
      setcopticTitle(item.CopticTitle);
      setarabicTitle(item.ArabicTitle);
    }
    navigation.setOptions({
      title: englishTitle,
      headerTitleStyle: {
        fontSize: 10,
      },
      header: () => (
        <CustomHeader
          navigation={navigation}
          english={englishTitle}
          coptic={copticTitle}
          arabic={arabicTitle}
        />
      ),
    });
  }, [newIndex]);
  function hideHeader() {
    // Function to change navigation options

    navigation.setOptions({
      headerShown: !NavbarVisibility,
    });

    setNavbarVisibility(!NavbarVisibility);
  }

  function renderItems(itemData) {
    let content = {};
    // setNavbarTitle(itemData.item.CopticTitle);
    switch (itemData.item.part.type) {
      case "Base":
        //MainView
        //check Rule
        //check Visible
        //Get View

        content = <BaseView item={itemData.item.part}></BaseView>;
        //content = <Text>Main</Text>;

        // viewArray.push(
        //
        // );
        break;
      case "Melody":
        //Title
        //check Rule
        //check Visible
        //Get View
        content = <MelodyView item={itemData.item.part}></MelodyView>;
        // content = <Text>Main</Text>;

        break;
      case "Title":
        //Title
        //check Rule
        //check Visible
        //Get View
        content = <TitleView item={itemData.item.part}></TitleView>;
        //content = <Text>Main</Text>;

        break;
      case "Ritual":
        //Ritual
        //check Rule
        //check Visible
        //Get View
        content = <RitualView item={itemData.item.part}></RitualView>;
        //content = <Text>Main</Text>;

        break;
      case "Button":
        //Button
        //check Rule
        //check Visible
        //Get View
        content = <ButtonView item={itemData.item.part}></ButtonView>;
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
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // change as needed
        }}
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
          }, 100);
        }}
        initialNumToRender={200}
        renderItem={renderItems}
        keyExtractor={(item) => {
          return item.key;
        }}
      />
      {NavbarVisibility && (
        <BottomBar
          navigation={navigation}
          dataArray={menuData}
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
