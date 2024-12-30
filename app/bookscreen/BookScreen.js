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
      onPress={onPressSettings}
    >
      <MaterialCommunityIcons
        name="cog"
        size={30}
        color={getColor("LabelColor")}
      />
    </TouchableOpacity>
    <TouchableOpacity style={styles.headerButton} onPress={onPressContents}>
      <MaterialCommunityIcons
        name="table-of-contents"
        size={40}
        color={getColor("LabelColor")}
      />
    </TouchableOpacity>
  </>
));

// renderItems function
export const renderItems = ({
  item,
  navigation,
  router,
  dispatch,
  bookPath,
  flatListRef,
  bookContents,
  toggleAccordion,
  expanded,
}) => {
  const viewTypeMap = {
    Base: <BaseView item={item.part} mykey={item.key} />,
    Melody: <MelodyView item={item.part} />,
    Title: <TitleView item={item.part} navigation={navigation} />,
    Ritual: <RitualView item={item.part} />,
    MainTitle: <MainTitleView item={item.part} />,
    Button: (
      <ButtonView
        router={router}
        dispatch={dispatch}
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
  return viewTypeMap[item.part.Type];
};

const BookScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const flatListRef = useRef();
  const { bookPath, motherSource, bishopButton, indexToScroll } =
    useLocalSearchParams();
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const bishopIsPresent = useSelector(
    (state) => state.settings.BishopIsPresent
  );
  const isAndroid = Platform.OS === "ios" ? false : true;

  const values = getFullViewModel(bookPath, motherSource);
  const bookContents = values[0];
  const [isLoading, setIsLoading] = useState(true);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const menuData = values[1];
  const bottomSheetRef = useRef(null);
  const contentsSheetRef = useRef(null);
  const navigation = useNavigation();
  const snapPoints = ["90%"];

  const [expanded, setExpanded] = useState([]);

  const toggleAccordion = useCallback((index) => {
    setExpanded((prevExpanded) => {
      const updatedExpanded = [...prevExpanded];
      updatedExpanded[index] = !updatedExpanded[index];
      return updatedExpanded;
    });
  }, []);

  useEffect(() => {
    const fontfamily = appLanguage === "eng" ? "english-font" : "arabic-font";
    const fontsize = isTablet ? 30 : 15;
    navigation.setOptions({
      title: bookContents[0]?.part.English,
      headerStyle: {
        backgroundColor: NavigationBarColor,
      },
      headerTitleStyle: {
        fontSize: fontsize,
        fontFamily: fontfamily,
      },
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, [appLanguage, bookContents, flatListRef]);

  const [currentPage, setCurrentPage] = useState(1);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const loadMoreData = async (targetIndex) => {
    if (isFetching || allDataLoaded) return;

    setIsFetching(true);

    try {
      const newData = await fetchMoreDataFromAPI(currentPage);
      setData((prevData) => [...prevData, ...newData]);
      setCurrentPage((prevPage) => prevPage + 1);

      if (newData.length === 0) {
        setAllDataLoaded(true);
      }

      if (data.length + newData.length > targetIndex) {
        flatListRef.current.scrollToIndex({ index: targetIndex });
      } else {
        await loadMoreData(targetIndex);
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const settingsPressed = () => bottomSheetRef?.current.present();
  const contentsPressed = () => contentsSheetRef?.current.present();
  const contentsClose = () => contentsSheetRef?.current.dismiss();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButtons
          onPressSettings={settingsPressed}
          onPressContents={contentsPressed}
        />
      ),
    });
  }, []);

  const scrollToKey = (key) => {
    const item = bookContents.find(({ key: itemKey }) => itemKey === key.key);
    if (!item) return;
    const title = appLanguage === "eng" ? item.EnglishTitle : item.ArabicTitle;
    flatListRef.current.scrollToIndex({
      index: item.key,
      animated: false,
    });
    contentsSheetRef?.current?.dismiss();
  };

  const memoizedRenderItems = useCallback(
    (props) =>
      renderItems({
        ...props,
        navigation,
        router,
        dispatch,
        bookPath,
        flatListRef,
        bookContents,
        toggleAccordion,
        expanded,
      }),
    [
      navigation,
      router,
      dispatch,
      bookPath,
      flatListRef,
      bookContents,
      toggleAccordion,
      expanded,
    ]
  );

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
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          style={{ flex: 1, backgroundColor: pageBackgroundColor }}
          initialNumToRender={bookContents.length}
          showsVerticalScrollIndicator={false}
          data={bookContents}
          renderItem={memoizedRenderItems}
          keyExtractor={(item) => item.key}
          bounces={false}
          removeClippedSubviews={true}
        />
        {bishopIsPresent && bishopButton && (
          <FloatingButton navigation={navigation} />
        )}
      </View>
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
