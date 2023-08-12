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
  View,
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
import ExpanderView from "../components/ViewTypes/ExpanderView";
import BishopModal from "./BishopModal";
import LoadingScreen from "./LoadingScreen";
import SettingsModal from "../components/BottomBar/SettingsModal";
import ContentsModal from "../components/BottomBar/ContentsModal";
import { getColor } from "../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../viewModel/getFullViewModel";
import FloatingButton from "../components/ViewTypes/FloatingBishopButton";

const BookScreen = React.memo(({ navigation, route }) => {
  const { height, width } = useWindowDimensions();

  const flatListRef = useRef();
  const { bookPath, motherSource, BishopButton } = route.params;
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const pagination = useSelector((state) => state.settings.pagination);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [NavbarVisibility, setNavbarVisibility] = useState(true);
  const [settingsModalVisible, setsettingsModalVisible] = useState(false);
  const BishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const values = getFullViewModel(bookPath, motherSource);
  const [bookContents, setBookContents] = useState(values[0]);
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const [menuData, setMenuData] = useState(values[1]);
  const bottomSheetRef = useRef(null);
  const contentsSheetRef = useRef(null);

  // variables
  const snapPoints = ["75%"];
  const [englishTitle, setEnglishTitle] = useState(
    bookContents[0].EnglishTitle
  );
  const [arabicTitle, setArabicTitle] = useState(bookContents[0].ArabicTitle);

  const handleScroll = useCallback((event) => {
    const currentPosition = event.nativeEvent.contentOffset.y;
    if (currentPosition > scrollPosition + 5) {
      setNavbarVisibility(false);
    } else {
      setNavbarVisibility(true);
    }
    setScrollPosition(currentPosition);
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstItem = viewableItems[0].item;
      if (
        firstItem.EnglishTitle !== englishTitle &&
        firstItem.EnglishTitle !== undefined
      ) {
        setEnglishTitle(firstItem.EnglishTitle);
        setArabicTitle(firstItem.ArabicTitle);
      }
    }
  }).current;

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
  }, [appLanguage, englishTitle, arabicTitle, isTablet, navigation]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, []);

  const settingsPressed = () => {
    bottomSheetRef?.current.present();
  };

  const contentsPressed = () => {
    contentsSheetRef?.current.present();
  };

  const HeaderRightButtons = ({ onPressSettings, onPressContents }) => {
    return (
      <>
        <Pressable
          style={styles.settingsheaderButton}
          onPress={onPressSettings}
        >
          <Icon name="ios-settings-outline" size={30} color={labelColor} />
        </Pressable>
        <Pressable style={styles.headerButton} onPress={onPressContents}>
          <MaterialCommunityIcons
            name="table-of-contents"
            size={40}
            color={labelColor}
          />
        </Pressable>
      </>
    );
  };

  React.useLayoutEffect(() => {
    const headerRightComponent = () => (
      <HeaderRightButtons
        onPressSettings={settingsPressed}
        onPressContents={contentsPressed}
      />
    );

    navigation.setOptions({
      headerRight: headerRightComponent,
    });
  }, [navigation]);

  const scrollToKey = (key) => {
    const item = bookContents.find((item) => item.key === key);
    if (item) {
      setEnglishTitle(item.EnglishTitle);
      setArabicTitle(item.ArabicTitle);
      flatListRef.current.scrollToIndex({ index: key, animated: false });
      contentsSheetRef?.current.dismiss();
    }
  };

  const renderItems = ({ item }) => {
    switch (item.part.Type) {
      case "Base":
        return <BaseView item={item.part} mykey={item.key} />;
      case "Melody":
        return <MelodyView item={item.part} />;
      case "Title":
        return <TitleView item={item.part} />;
      case "Ritual":
        return <RitualView item={item.part} />;
      case "MainTitle":
        return <MainTitleView item={item.part} />;
      case "Button":
        return (
          <ButtonView
            item={item.part}
            motherSource={bookPath}
            flatListRef={flatListRef}
            viewData={bookContents}
            navigation={navigation}
          />
        );
      default:
        return <Text>Default</Text>;
    }
  };

  const onScrollToIndexFailed = (error) => {
    flatListRef.current.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: false,
    });
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

  return (
    <BottomSheetModalProvider>
      <SettingsModal bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      <ContentsModal
        bottomSheetRef={contentsSheetRef}
        snapPoints={snapPoints}
        menuData={menuData}
        scrollToKey={scrollToKey}
      />

      <FlatList
        ref={flatListRef}
        style={[styles.container, { backgroundColor: pageBackgroundColor }]}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        data={bookContents}
        pagingEnabled={pagination}
        onScroll={handleScroll}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={bookContents.length}
        bounces={false}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
      />
      {BishopIsPresent && BishopButton && (
        <FloatingButton navigation={navigation} />
      )}
    </BottomSheetModalProvider>
  );
});

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  settingsheaderButton: {
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
