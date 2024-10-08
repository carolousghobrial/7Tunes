import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import BaseView from "../components/ViewTypes/BaseView";
import MelodyView from "../components/ViewTypes/MelodyView";
import TitleView from "../components/ViewTypes/TitleView";
import RitualView from "../components/ViewTypes/RitualView";
import ButtonView from "../components/ViewTypes/ButtonView";
import MainTitleView from "../components/ViewTypes/MainTitleView";
import BishopModal from "./BishopModal";
import LoadingScreen from "./LoadingScreen";
import SettingsModal from "../components/BottomBar/SettingsModal";
import ContentsModal from "../components/BottomBar/ContentsModal";
import { getColor } from "../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../viewModel/getFullViewModel";
import FloatingButton from "../components/ViewTypes/FloatingBishopButton";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { isAction } from "@reduxjs/toolkit";
import AccordionView from "../components/ViewTypes/AccordionView.js";

const HeaderRightButtons = ({ onPressSettings, onPressContents }) => (
  <>
    <Pressable style={styles.settingsHeaderButton} onPress={onPressSettings}>
      <MaterialCommunityIcons
        name="cog"
        size={30}
        color={getColor("LabelColor")}
      />
    </Pressable>
    <Pressable style={styles.headerButton} onPress={onPressContents}>
      <MaterialCommunityIcons
        name="table-of-contents"
        size={40}
        color={getColor("LabelColor")}
      />
    </Pressable>
  </>
);
const BookScreen = React.memo(({ navigation, route }) => {
  const { height, width } = useWindowDimensions();
  const contentsRef = useRef(null);

  const flatListRef = useRef();
  const {
    bookPath,
    motherSource,
    bishopButton,
    englishTitle,
    arabicTitle,
    Switch,
  } = route.params;
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const pagination = useSelector((state) => state.settings.pagination);
  const [navbarVisibility, setNavbarVisibility] = useState(true);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const bishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const isAndroid = Platform.OS === "ios" ? false : true;

  const values = getFullViewModel(bookPath, motherSource);
  const [bookContents, setBookContents] = useState(values[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [IsOnlyOneViewShown, setIsOnlyOneViewShown] = useState(false);
  const [scrolledBack, setscrolledBack] = useState(false);
  const [IsTopNotBeginning, setIsTopNotBeginning] = useState(false);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const [menuData, setMenuData] = useState(values[1]);
  const bottomSheetRef = useRef(null);
  const contentsSheetRef = useRef(null);

  const snapPoints = ["90%"];
  const [navTitle, setNavTitle] = useState(bookContents[0]?.part.English);
  const [currKey, setcurrKey] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const firstItem = viewableItems[0]?.item;

    if (!firstItem) {
      setIsOnlyOneViewShown(true); // Handle case when there are no viewable items
    } else {
      setIsOnlyOneViewShown(
        viewableItems.length <= 1 ||
          (viewableItems.length === 2 &&
            ["Priest", "Deacon", "People", "Reader", "Ritual"].includes(
              firstItem.part.Side
            ))
      );

      const side = firstItem.part.Side;
      const type = firstItem.part.Type;

      if (
        ["South", "North", "Neutral", "Refrain", "Title"].includes(side) ||
        (type === "Button" && side !== "Ritual")
      ) {
        setcurrKey(firstItem.key);
      } else {
        const firstMatchingItem = viewableItems.find(
          (myitem) =>
            ["South", "North", "Neutral", "Refrain", "Title"].includes(
              myitem.item.part.Side
            ) ||
            (myitem.item.part.Type === "Button" &&
              myitem.item.part.Side !== "Ritual")
        );

        if (firstMatchingItem) {
          setcurrKey(firstMatchingItem.key);
        }
      }

      const title =
        appLanguage === "eng"
          ? firstItem?.EnglishTitle
          : firstItem?.ArabicTitle;
      if (title && title !== navTitle) {
        setNavTitle(title);
      }
    }
  }).current;
  const [expanded, setExpanded] = useState([]);

  const toggleAccordion = (index) => {
    const expandedCopy = [...expanded];

    expandedCopy[index] = !expandedCopy[index];

    setExpanded(expandedCopy);
  };
  useEffect(() => {
    const fontfamily = appLanguage === "eng" ? "english-font" : "arabic-font";
    const fontsize = isTablet ? 30 : 15;
    navigation.setOptions({
      title: navTitle,
      headerTitleStyle: {
        fontSize: fontsize,
        fontFamily: fontfamily,
      },
    });

    if (Switch !== undefined && flatListRef.current) {
      setTimeout(() => {
        const itemToFind = bookContents.findIndex(
          (item) => item.path === Switch
        );
        if (itemToFind !== -1) {
          flatListRef.current.scrollToIndex({
            index: bookContents[itemToFind]?.key,
            animated: false,
          });
        }
      }, 10);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 10);
    }
  }, [navTitle, appLanguage, Switch, bookContents, flatListRef]);

  const settingsPressed = useCallback(() => {
    bottomSheetRef?.current.present();
  }, [bottomSheetRef]);

  const contentsPressed = useCallback(() => {
    contentsSheetRef?.current.present();

    if (contentsRef.current) {
      contentsRef.current.scrollToMenuKey(10); // Example key
    }
  }, [contentsSheetRef]);

  const contentsClose = useCallback(() => {
    contentsSheetRef?.current.dismiss();
  }, [contentsSheetRef]);

  React.useLayoutEffect(() => {
    const headerRightComponent = () => (
      <HeaderRightButtons
        onPressSettings={settingsPressed}
        onPressContents={contentsPressed}
      />
    );

    navigation.setOptions({
      headerRight: headerRightComponent,
      headerShown: navbarVisibility,
    });
  }, [navigation, navbarVisibility]);

  const scrollToKey = (key) => {
    const item = bookContents.find((item) => item.key === key);
    if (item) {
      const title =
        appLanguage === "eng" ? item?.EnglishTitle : item?.ArabicTitle;
      setNavTitle(title);
      setcurrKey(key);

      flatListRef.current.scrollToIndex({ index: key, animated: false });
      contentsSheetRef?.current.dismiss();
    }
  };

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END && pagination) {
      // Gesture ended, determine the direction
      const velocityY = nativeEvent.velocityY;
      if (velocityY > 0) {
        // Right swipe
        scrollBack(); // Perform actions for a right swipe
      } else if (velocityY < 0) {
        // Left swipe
        scrollToNextItem();
        // Perform actions for a left swipe
      }
    }
  };
  const renderItems = ({ item }) => {
    const viewTypeMap = {
      Base: <BaseView item={item.part} mykey={item.key} />,
      Melody: <MelodyView item={item.part} />,
      Title: <TitleView item={item.part} navigation={navigation} />,
      Ritual: <RitualView item={item.part} />,
      MainTitle: <MainTitleView item={item.part} />,
      Button: (
        <ButtonView
          mykey={item.key}
          item={item.part}
          motherSource={bookPath}
          flatListRef={flatListRef}
          viewData={bookContents}
          navigation={navigation}
        />
      ),
      Accordion: (
        <AccordionView
          mykey={item.key}
          flatListRef={flatListRef}
          item={item.part}
          motherSource={bookPath}
          toggleAccordion={toggleAccordion}
          expanded={expanded}
        />
      ),
    };

    return (
      <Pressable onPress={() => setNavbarVisibility(!navbarVisibility)}>
        {viewTypeMap[item.part.Type]}
      </Pressable>
    );
  };
  const scrollToNextItem = () => {
    if (IsOnlyOneViewShown && currKey !== 0) {
      const offset =
        flatListRef.current._listRef._scrollMetrics.offset + height;
      flatListRef.current.scrollToOffset({
        offset,
        animated: true,
      });
      setIsTopNotBeginning(true);
    } else {
      flatListRef.current.scrollToIndex({
        index: currKey + 1,
        animated: true,
      });
    }
  };
  const scrollBack = () => {
    if (currKey === 0) {
      return;
    }
    if (IsTopNotBeginning) {
      flatListRef.current.scrollToIndex({
        index: currKey,
        animated: true,
      });
      setIsTopNotBeginning(false);
    } else {
      const newInd = currKey - 1;
      flatListRef.current.scrollToIndex({
        index: newInd,
        animated: true,
      });
      setcurrKey(newInd);
    }
  };
  const onScrollToIndexFailed = (error) => {
    const offset = error.averageItemLength * error.index;
    flatListRef.current.scrollToOffset({ offset, animated: false });
    setTimeout(() => {
      if (flatListRef.current !== null) {
        flatListRef.current.scrollToIndex({
          index: error.index,
          animated: false,
        });
      }
    }, 10);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  const keyExtractor = (item) => item.key;

  return (
    <BottomSheetModalProvider>
      <SettingsModal bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      <ContentsModal
        ref={contentsRef}
        bottomSheetRef={contentsSheetRef}
        snapPoints={snapPoints}
        currentKey={currKey}
        menuData={menuData}
        contentsClose={contentsClose}
        scrollToKey={scrollToKey}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          style={{ flex: 1, backgroundColor: pageBackgroundColor }}
          onViewableItemsChanged={onViewableItemsChanged}
          showsVerticalScrollIndicator={false}
          data={bookContents}
          // scrollEnabled={!pagination}

          onScrollToIndexFailed={onScrollToIndexFailed}
          initialNumToRender={bookContents.length}
          bounces={false}
          removeClippedSubviews={true}
          renderItem={renderItems}
          keyExtractor={keyExtractor}
        />
        {bishopIsPresent && bishopButton && (
          <FloatingButton navigation={navigation} />
        )}
      </View>
    </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  settingsHeaderButton: {
    marginRight: 10,
    alignSelf: "stretch",
    justifyContent: "center",
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
    top: -12,
    fontSize: 25,
    backgroundColor: "transparent",
    color: "#AA4A44",
    zIndex: 1,
  },
});

export default BookScreen;
