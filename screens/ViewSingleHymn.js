import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getMain } from "../viewModel/getFullViewModel";
import BaseView from "../components/ViewTypes/BaseView";
import MelodyView from "../components/ViewTypes/MelodyView";
import TitleView from "../components/ViewTypes/TitleView";
import RitualView from "../components/ViewTypes/RitualView";
import ButtonView from "../components/ViewTypes/ButtonView";
import MainTitleView from "../components/ViewTypes/MainTitleView";
import SettingsModal from "../components/BottomBar/SettingsModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const ViewSingleHymn = memo(({ navigation, route }) => {
  const { height, width } = useWindowDimensions();

  const bottomSheetRef = useRef(null);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const pagination = useSelector((state) => state.settings.pagination);

  const snapPoints = ["75%"];
  const flatListRef = useRef();
  const [navbarVisibility, setNavbarVisibility] = useState(true);
  const [IsOnlyOneViewShown, setIsOnlyOneViewShown] = useState(false);
  const [IsTopNotBeginning, setIsTopNotBeginning] = useState(false);

  const path = route.params.path;
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");

  const motherSource = route.params.motherSource;
  const rule = route.params.rule;
  const title =
    appLanguage === "eng"
      ? route.params.englishTitle
      : route.params.arabicTitle;
  const [currKey, setcurrKey] = useState(0);

  const [navTitle, setNavTitle] = useState(title);
  const data = getMain(path, motherSource, false, rule, 0)[0];
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length <= 1) {
      setIsOnlyOneViewShown(true);
    } else {
      const firstItem = viewableItems[0].item;
      setcurrKey(firstItem.key);

      setIsOnlyOneViewShown(false);

      const title =
        appLanguage === "eng"
          ? firstItem?.EnglishTitle
          : firstItem?.ArabicTitle;
      if (title !== navTitle && title !== undefined) {
        setNavTitle(title);
      }
    }
  }).current;
  const renderItems = ({ item }) => {
    let content = null;
    switch (item.part.Type) {
      case "Base":
        content = <BaseView item={item.part} />;
        break;
      case "Melody":
        content = <MelodyView item={item.part} />;
        break;
      case "Title":
        content = <TitleView item={item.part} />;
        break;
      case "Ritual":
        content = <RitualView item={item.part} />;
        break;
      case "MainTitle":
        content = <MainTitleView item={item.part} />;
        break;
      case "Button":
        content = (
          <ButtonView
            item={item.part}
            flatListRef={flatListRef}
            viewData={memoizedData}
            navigation={navigation}
          />
        );
        break;
      default:
        content = <Text>Default</Text>;
        break;
    }
    return <Pressable onPress={hideHeader}>{content}</Pressable>;
  };

  const hideHeader = () => {
    setNavbarVisibility(!navbarVisibility);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: navTitle,
      headerRight: () => (
        <Pressable style={{ marginHorizontal: 5 }} onPress={settingsPressed}>
          <MaterialCommunityIcons
            name="cog"
            size={30}
            color={getColor("LabelColor")}
          />
        </Pressable>
      ),
      headerShown: navbarVisibility,
    });
  }, [navigation, navbarVisibility, navTitle]);
  const scrollToNextItem = () => {
    if (IsOnlyOneViewShown && currKey !== 0) {
      const offset =
        flatListRef.current._listRef._scrollMetrics.offset +
        height -
        height * 0.2;
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
    if (IsTopNotBeginning) {
      flatListRef.current.scrollToIndex({
        index: currKey,
        animated: true,
      });
      setIsTopNotBeginning(false);
    } else if (currKey !== 0) {
      flatListRef.current.scrollToIndex({
        index: currKey - 1,
        animated: true,
      });
    }
  };
  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END && pagination) {
      // Gesture ended, determine the direction
      const velocityX = nativeEvent.velocityX;

      if (velocityX > 0) {
        // Right swipe
        scrollBack(); // Perform actions for a right swipe
      } else if (velocityX < 0) {
        // Left swipe
        scrollToNextItem();
        // Perform actions for a left swipe
      }
    }
  };
  const settingsPressed = () => {
    bottomSheetRef?.current.present();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SettingsModal
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
        />
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <FlatList
            ref={flatListRef}
            onViewableItemsChanged={onViewableItemsChanged}
            style={{ backgroundColor: pageBackgroundColor }}
            showsVerticalScrollIndicator={false}
            data={data}
            removeClippedSubviews={true}
            renderItem={renderItems}
            keyExtractor={(item) => item.key}
          />
        </PanGestureHandler>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
});

export default ViewSingleHymn;

const styles = StyleSheet.create({
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
