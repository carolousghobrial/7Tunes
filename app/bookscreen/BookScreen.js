import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
  TouchableOpacity,
  View,
  Platform,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import BaseView from "../../components/ViewTypes/BaseView";
import MelodyView from "../../components/ViewTypes/MelodyView";
import TitleView from "../../components/ViewTypes/TitleView";
import RitualView from "../../components/ViewTypes/RitualView";
import ButtonView from "../../components/ViewTypes/ButtonView";
import MainTitleView from "../../components/ViewTypes/MainTitleView";
import LoadingScreen from "../../screens/LoadingScreen";
import SettingsModal from "../../components/BottomBar/SettingsModal";
import ContentsModal from "../../components/BottomBar/ContentsModal";
import { getColor } from "../../helpers/SettingsHelpers.js";
import { getFullViewModel } from "../../viewModel/getFullViewModel";
import FloatingButton from "../../components/ViewTypes/FloatingBishopButton";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import AccordionView from "../../components/ViewTypes/AccordionView.js";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

const HeaderRightButtons = memo(({ onPressSettings, onPressContents }) => (
  <>
    <TouchableOpacity
      style={styles.settingsHeaderButton}
      onPressIn={onPressSettings}
    >
      <MaterialCommunityIcons
        name="cog"
        size={30}
        color={getColor("LabelColor")}
      />
    </TouchableOpacity>
    <TouchableOpacity style={styles.headerButton} onPressIn={onPressContents}>
      <MaterialCommunityIcons
        name="table-of-contents"
        size={40}
        color={getColor("LabelColor")}
      />
    </TouchableOpacity>
  </>
));

// renderItems function

const BookScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const flatListRef = useRef();
  const { bookPath, motherSource, bishopButton, indexToScroll, Switch } =
    useLocalSearchParams();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const bishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const isAndroid = Platform.OS === "ios" ? false : true;
  const values = getFullViewModel(bookPath, motherSource);
  const [currentPath, setCurrentPath] = useState(values[0][0].path);
  const [pageKey, setPageKey] = useState(0); // Key for forcing rerender

  const [bookContents, setBookContents] = useState(
    getFirstContinuousRangeWithUniquePaths(6, values[0])
  );

  function getFirstContinuousRangeWithUniquePaths(
    pathCount,
    data,
    currentPaths = []
  ) {
    const uniquePaths = new Set(currentPaths);
    let endIndex = -1;

    // Iterate through the data and track unique paths
    for (let i = 0; i < data.length; i++) {
      const path = data[i].path || data[i].part?.Path;

      if (path && !uniquePaths.has(path)) {
        uniquePaths.add(path);

        // Once we have enough unique paths, record the index and break
        if (uniquePaths.size === pathCount) {
          endIndex = i;
          break;
        }
      }
    }

    // If we found the required number of unique paths, return the slice; otherwise, return all data
    return endIndex !== -1 ? data.slice(0, endIndex + 1) : data;
  }

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      const firstItem = viewableItems[0]?.item;

      if (!firstItem) return;

      const newPath = firstItem.part?.Path || firstItem.path;

      if (newPath && currentPath !== newPath) {
        setCurrentPath(newPath);

        setBookContents((prevContents) => {
          const uniquePaths = prevContents.map(
            (item) => item.path || item.part?.Path
          );
          return getFirstContinuousRangeWithUniquePaths(
            1,
            values[0],
            uniquePaths
          );
        });
      }
    },
    [currentPath, values]
  );

  //const [bookContents, bookContents] = boo;
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const menuData = values[1];
  const bottomSheetRef = useRef(null);
  const contentsSheetRef = useRef(null);
  const navigation = useNavigation();
  const snapPoints = ["90%"];

  useEffect(() => {
    const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
    const fontSize = isTablet ? 30 : 15;

    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButtons
          onPressSettings={settingsPressed}
          onPressContents={contentsPressed}
        />
      ),
      title: bookContents[0]?.part?.English || "Default Title",
      headerStyle: {
        backgroundColor: NavigationBarColor,
      },
      headerTitleStyle: {
        fontSize,
        fontFamily,
      },
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, [appLanguage, bookContents, flatListRef]);

  const settingsPressed = () => bottomSheetRef?.current.present();
  const contentsPressed = () => contentsSheetRef?.current.present();
  const contentsClose = () => contentsSheetRef?.current.dismiss();

  const scrollToKey = (key) => {
    try {
      const targetIndex = values[0]?.findIndex(
        ({ key: itemKey }) => itemKey === key.key
      );

      if (targetIndex === -1) return; // Exit if the key is not found

      setIsLoading(true); // Start loading

      if (targetIndex >= bookContents.length) {
        // Load data until the target index if not already loaded
        loadDataUntilIndex(targetIndex);
      } else {
        // Scroll directly if data is already loaded
        scrollToIndex(targetIndex);
      }
    } catch (error) {
      console.error("An error occurred in scrollToKey:", error);

      try {
        console.log("Attempting recovery: scrolling to the bottom.");
        scrollToIndex(bookContents.length - 1); // Scroll to the bottom

        // Retry scrolling to the target key
        setTimeout(() => {
          const targetIndex = values[0]?.findIndex(
            ({ key: itemKey }) => itemKey === key.key
          );
          if (targetIndex !== -1) {
            scrollToIndex(targetIndex);
          } else {
            console.warn("Key still not found after recovery attempt.");
          }
        }, 500); // Delay to ensure smooth recovery
      } catch (recoveryError) {
        console.error("Recovery attempt failed:", recoveryError);
      }
    }
  };

  const loadDataUntilIndex = (targetIndex) => {
    // Avoid redundant data loading
    setBookContents((prevContents) => {
      if (prevContents.length >= targetIndex + 1) return prevContents; // Data is already loaded

      const newRangeStart = prevContents.length;
      const newRangeEnd = targetIndex + 5; // Load up to the target index (inclusive)
      const newData = values[0].slice(newRangeStart, newRangeEnd);

      return [...prevContents, ...newData];
    });

    setPageKey((prevKey) => prevKey + 1); // Increment page key after loading new data

    // Use setTimeout to scroll after the data is loaded and rendered
    setTimeout(() => {
      scrollToIndex(targetIndex);
    }, 200); // Ensure the state update and render are complete before scrolling
  };

  const scrollToIndex = (targetIndex) => {
    flatListRef.current.scrollToIndex({
      index: targetIndex,
      animated: false,
    });
    setIsLoading(false); // Stop loading after scrolling is complete
    contentsSheetRef?.current?.dismiss();
  };

  // Handle scroll failures
  const handleScrollToIndexFailed = ({ index }) => {
    setTimeout(() => {
      flatListRef.current.scrollToIndex({
        index,
        animated: false, // You can keep this as true for smooth scrolling
      });
    }, 200); // Add a small delay to allow items to be rendered
  };
  const renderItems = ({ item }) => {
    const viewTypeMap = {
      Base: <BaseView item={item.part} mykey={item.key} />,
      Melody: <MelodyView item={item.part} />,
      Title: <TitleView item={item.part} />,
      Ritual: <RitualView item={item.part} />,
      MainTitle: <MainTitleView item={item.part} />,
      Button: (
        <ButtonView
          item={item.part}
          motherSource={bookPath}
          flatListRef={flatListRef}
          viewData={bookContents}
        />
      ),
      Accordion: (
        <AccordionView
          mykey={item.key}
          item={item.part}
          motherSource={bookPath}
        />
      ),
    };
    return viewTypeMap[item.part.Type];
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pageBackgroundColor,
        }}
      >
        <Image
          style={{
            flex: 8,
            height: "50%",
            borderRadius: 100 / 2,
            overflow: "hidden",
          }}
          source={require("../../assets/images/logofinal.png")}
        />
        <ActivityIndicator
          style={{ flex: 2 }}
          size="large"
          color={labelColor}
        />
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <SettingsModal bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      <ContentsModal
        bottomSheetRef={contentsSheetRef}
        snapPoints={snapPoints}
        menuData={menuData}
        contentsClose={contentsClose}
        scrollToKey={scrollToKey}
      />
      <SafeAreaView
        key={pageKey}
        style={{ flex: 1, backgroundColor: pageBackgroundColor }}
      >
        <FlatList
          ref={flatListRef}
          style={{ flex: 1, backgroundColor: pageBackgroundColor }}
          initialNumToRender={bookContents.length}
          showsVerticalScrollIndicator={false}
          data={bookContents}
          onViewableItemsChanged={handleViewableItemsChanged}
          renderItem={renderItems}
          keyExtractor={(item) => item.key}
          onScrollToIndexFailed={handleScrollToIndexFailed} // Add error handler
          bounces={false}
          removeClippedSubviews={true}
        />
        {bishopIsPresent && bishopButton && (
          <FloatingButton navigation={navigation} />
        )}
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  settingsHeaderButton: {
    marginRight: 10,
    alignSelf: "stretch",
    justifyContent: "center",
  },
});

export default BookScreen;
