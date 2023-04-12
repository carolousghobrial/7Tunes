import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  StyleSheet,
  Text,
  FlatList,
  Pressable,
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
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../viewModel/getFullViewModel";

const BookScreen = React.memo(({ navigation, route }) => {
  const flatListRef = useRef();
  let labelColor = getColor("LabelColor");

  var pageBackgroundColor = getColor("pageBackgroundColor");
  const pagination = useSelector((state) => state.settings.pagination);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const memoizedNavbarVisibility = useMemo(() => {
    return NavbarVisibility;
  }, [NavbarVisibility]);
  const handleScroll = (event) => {
    const currentPosition = event.nativeEvent.contentOffset.y;
    if (currentPosition > scrollPosition) {
      if (memoizedNavbarVisibility) {
        setNavbarVisibility(false);
      }
    } else {
      if (!memoizedNavbarVisibility) {
        setNavbarVisibility(true);
      }
      
    }
    setScrollPosition(currentPosition);
  };

  const [index, setIndex] = useState(0);
  const [settingsModalVisible, setsettingsModalVisible] = useState(false);

  const values = getFullViewModel(
    route.params.bookPath,
    route.params.motherSource
  );
  const memoizedData = useMemo(() => values[0], [values[0]]);
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const [menuData, setMenuData] = useState(values[1]);
  const [englishTitle, setenglishTitle] = useState(
    memoizedData[0].EnglishTitle
  );
  const [arabicTitle, setarabicTitle] = useState(memoizedData[0].ArabicTitle);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      if (
        viewableItems[0].item.EnglishTitle !== englishTitle &&
        viewableItems[0].item.EnglishTitle !== undefined
      ) {
        setenglishTitle(viewableItems[0].item.EnglishTitle);
        setarabicTitle(viewableItems[0].item.ArabicTitle);
      }
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
        onScroll={handleScroll}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={memoizedData.length}
        bounces={false}
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
