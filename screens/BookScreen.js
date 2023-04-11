import React, {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  PureComponent,
  useMemo,
} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Animated,
  Pressable,
  StatusBar,
} from "react-native";

import BaseView from "../components/ViewTypes/BaseView";
import MelodyView from "../components/ViewTypes/MelodyView";
import TitleView from "../components/ViewTypes/TitleView";
import RitualView from "../components/ViewTypes/RitualView";
import ButtonView from "../components/ViewTypes/ButtonView";
import MainTitleView from "../components/ViewTypes/MainTitleView";
import ExpanderView from "../components/ViewTypes/ExpanderView";
import LoadingScreen from "./LoadingScreen";
import SettingsModal from "../components/BottomBar/SettingsModal";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../viewModel/getFullViewModel";
const _spacing = 10;

const BookScreen = React.memo(({ navigation, route }) => {
  const flatListRef = useRef();
  const visibleItemRef = useRef(null);
  let labelColor = getColor("LabelColor");

  var pageBackgroundColor = getColor("pageBackgroundColor");
  const pagination = useSelector((state) => state.settings.pagination);

  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const [index, setIndex] = useState(0);
  const [howMcuhToScroll, sehowMcuhToScroll] = useState(0);
  const [scrollToIndex, setscrollToIndex] = useState(0);
  const [settingsModalVisible, setsettingsModalVisible] = useState(false);

  const values = getFullViewModel(
    route.params.bookPath,
    route.params.motherSource
  );
  const memoizedData = useMemo(() => values[0], [values[0]]);
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);

  // const [data, setData] = useState(values[0]);
  const [menuData, setMenuData] = useState(values[1]);
  const [englishTitle, setenglishTitle] = useState(
    memoizedData[0].EnglishTitle
  );
  const [arabicTitle, setarabicTitle] = useState(memoizedData[0].ArabicTitle);
  // const [prevIndexStack, setprevIndexStack] = useState([0]);

  var currentIndex = 0;
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      if (
        viewableItems[0].item.EnglishTitle !== englishTitle &&
        viewableItems[0].item.EnglishTitle !== undefined
      ) {
        setenglishTitle(viewableItems[0].item.EnglishTitle);
        setarabicTitle(viewableItems[0].item.ArabicTitle);
      }
      //sehowMcuhToScroll(viewableItems.length - 1);
    }
  }).current;

  function scrollToKey(key) {
    setenglishTitle(memoizedData.find((item) => item.key === key).EnglishTitle);
    flatListRef.current.scrollToIndex({
      index: key,
      animated: false,
    });
    navigation.pop();
  }
  const renderItems = ({ item }) => {
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
      case "MainTitle":
        content = <MainTitleView item={item.part}></MainTitleView>;

        break;
      case "Button":
        content = (
          <ButtonView
            item={item.part}
            motherSource={route.params.bookPath}
            flatListRef={flatListRef}
            viewData={memoizedData}
            navigation={navigation}
          ></ButtonView>
        );
        break;
      default:
        return <Text>Default</Text>;
        break;
    }
    return <Pressable onPress={hideHeader}>{content}</Pressable>;
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: NavbarVisibility,
    });
  }, [NavbarVisibility]);
  useEffect(() => {
    var fontfamily = appLanguage === "eng" ? "english-font" : "arabic-font";
    var fontsize = isTablet ? 30 : 15;
    var title = appLanguage === "eng" ? englishTitle : arabicTitle;
    navigation.setOptions({
      title: title,
      headerTitleStyle: {
        fontSize: fontsize,
        fontFamily: fontfamily,
      },
    });
  }, [englishTitle]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, []);
  const settingsPressed = () => {
    setsettingsModalVisible(true);
  };
  const contentsPressed = () => {
    // handle button press here
    const closest = menuData.reduce((a, b) => {
      return Math.abs(b.key - index) < Math.abs(a.key - index) ? b : a;
    });
    const HighlitedIndex = menuData.findIndex(
      (item) => item.key === closest.key
    );
    navigation.navigate("ContentsModal", {
      MainTitle: menuData[0],
      menuData: menuData,
      initialKey: HighlitedIndex,
      scrollToKey,
    });
  };
  function closeModal() {
    setsettingsModalVisible(false);
  }
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Pressable style={{ marginHorizontal: 5 }} onPress={settingsPressed}>
            <Icon name="ios-settings-outline" size={30} color={labelColor} />
          </Pressable>
          <Pressable style={{ marginHorizontal: 5 }} onPress={contentsPressed}>
            <MaterialCommunityIcons
              name="table-of-contents"
              size={30}
              color={labelColor}
            />
          </Pressable>
        </>
      ),
    });
  }, [navigation]);
  // useEffect(() => {
  //   // Set initial header title
  // }, []);
  function hideHeader() {
    setNavbarVisibility(!NavbarVisibility);
  }
  function onScrollToIndexFailed(error) {
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
  }

  //
  // });
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <SettingsModal visible={settingsModalVisible} closeModal={closeModal} />
      <FlatList
        ref={flatListRef}
        style={[styles.container, { backgroundColor: pageBackgroundColor }]}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        data={memoizedData}
        pagingEnabled={pagination}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={memoizedData.length}
        // initialScrollIndex={scrollToIndex}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => {
          return item.key;
        }}
      />
    </>
  );
});

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
