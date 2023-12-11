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

const HeaderRightButtons = ({ onPressSettings, onPressContents }) => (
  <>
    <Pressable style={styles.settingsHeaderButton} onPress={onPressSettings}>
      <Icon
        name="ios-settings-outline"
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

  const values = getFullViewModel(bookPath, motherSource);
  const [bookContents, setBookContents] = useState(values[0]);
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const [menuData, setMenuData] = useState(values[1]);
  const bottomSheetRef = useRef(null);
  const contentsSheetRef = useRef(null);

  const snapPoints = ["90%"];
  const [navTitle, setNavTitle] = useState(bookContents[0]?.EnglishTitle);
  const [currKey, setcurrKey] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstItem = viewableItems[0].item;

      const title =
        appLanguage === "eng"
          ? firstItem?.EnglishTitle
          : firstItem?.ArabicTitle;
      if (title !== navTitle && title !== undefined) {
        setNavTitle(title);
        setcurrKey(firstItem.key);
      }
    }
  }).current;

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
  }, [navTitle, appLanguage, isTablet, navigation]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      if (Switch !== undefined) {
        const itemToFind = bookContents.findIndex(
          (item) => item.path === Switch
        );
        if (itemToFind !== -1) {
          flatListRef.current.scrollToIndex({
            index: bookContents[itemToFind]?.key,
            animated: false,
          });
        }
      }
    }, 10);
  }, [Switch, bookContents, flatListRef]);

  const settingsPressed = useCallback(() => {
    bottomSheetRef?.current.present();
  }, [bottomSheetRef]);

  const contentsPressed = useCallback(() => {
    contentsSheetRef?.current.present();
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
  const copyText = (part) => {
    console.log(part);
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
          item={item.part}
          motherSource={bookPath}
          flatListRef={flatListRef}
          viewData={bookContents}
          navigation={navigation}
        />
      ),
    };
    const returnView = viewTypeMap[item.part.Type];

    return (
      <Pressable onPress={() => setNavbarVisibility(!navbarVisibility)}>
        {returnView}
      </Pressable>
    );
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

  return (
    <BottomSheetModalProvider>
      <SettingsModal bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      <ContentsModal
        bottomSheetRef={contentsSheetRef}
        snapPoints={snapPoints}
        currentKey={currKey}
        menuData={menuData}
        contentsClose={contentsClose}
        scrollToKey={scrollToKey}
      />
      <FlatList
        ref={flatListRef}
        style={{ backgroundColor: pageBackgroundColor }}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        data={bookContents}
        pagingEnabled={pagination}
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={bookContents.length}
        bounces={false}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
      />
      {bishopIsPresent && bishopButton && (
        <FloatingButton navigation={navigation} />
      )}
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
