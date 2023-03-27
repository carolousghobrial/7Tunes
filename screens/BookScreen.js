import React, {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  PureComponent,
} from "react";
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
  const flatListRef = useRef();
  var pageBackgroundColor = getColor("pageBackgroundColor");

  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const [index, setIndex] = useState(0);
  const [howMcuhToScroll, sehowMcuhToScroll] = useState(0);
  const [scrollToIndex, setscrollToIndex] = useState(0);
  const [englishTitle, setenglishTitle] = useState("");
  const [copticTitle, setcopticTitle] = useState("");
  const [arabicTitle, setarabicTitle] = useState("");
  const values = getFullViewModel(route.params.bookPath);
  const [data, setData] = useState(values[0]);
  const [menuData, setMenuData] = useState(values[1]);
  const [prevIndexStack, setprevIndexStack] = useState([0]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // console.log("INDEX " + viewableItems[0].index);

      setIndex(viewableItems[0].index);
      sehowMcuhToScroll(viewableItems.length - 1);
    }
  }).current;

  function scrollDown() {
    var scrollnewIndex = index + howMcuhToScroll;

    if (scrollnewIndex >= data.length - 1) {
      return;
    }
    setprevIndexStack(prevIndexStack.concat(scrollnewIndex)); // Add the new value to the end of the array and update the state

    console.log(prevIndexStack);

    flatListRef.current.scrollToIndex({
      index: scrollnewIndex,
      animated: false,
    });
  }
  function scrollUp() {
    const popped = prevIndexStack.pop(); // Remove the last element from the array

    setprevIndexStack([...prevIndexStack]); // Update state with the new array

    var scrollnewIndex = prevIndexStack[prevIndexStack.length - 1];
    console.log(scrollnewIndex);
    if (scrollnewIndex <= 0 || scrollnewIndex == undefined) {
      scrollnewIndex = 0;
    }

    flatListRef.current.scrollToIndex({
      index: scrollnewIndex,
      animated: false,
    });
  }
  function scrollToKey(key) {
    flatListRef.current.scrollToIndex({
      index: key,
      animated: false,
    });
  }

  useEffect(() => {
    navigation.setOptions({
      title: englishTitle,
      headerTitleStyle: {
        fontSize: 10,
      },
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
        //console.log(item.part.Rule);
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
            flatListRef={flatListRef}
            viewData={data}
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
    //   onSwipeLeft={scrollDown}
    //   onSwipeRight={scrollUp}
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
          }, 50);
        }}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => {
          return item.key;
        }}
      />
      {NavbarVisibility && (
        <BottomBar
          navigation={navigation}
          dataArray={menuData}
          initialKey={index}
          scrollToKey={scrollToKey}
        />
      )}
    </View>
  );
}

export default memo(BookScreen);

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
