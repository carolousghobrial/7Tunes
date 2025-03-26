import React, {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../helpers/SettingsHelpers.js";
import { getMain } from "../viewModel/getFullViewModel.js";
import BaseView from "../components/ViewTypes/BaseView.js";
import MelodyView from "../components/ViewTypes/MelodyView.js";
import TitleView from "../components/ViewTypes/TitleView.js";
import RitualView from "../components/ViewTypes/RitualView.js";
import ButtonView from "../components/ViewTypes/ButtonView.js";
import MainTitleView from "../components/ViewTypes/MainTitleView.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SingleHymnAsView = memo(
  ({ path, motherSource, rule, englishTitle, arabicTitle }) => {
    const { height } = useWindowDimensions();
    const navigation = useNavigation();
    const [navbarVisibility, setNavbarVisibility] = useState(true);

    const bottomSheetRef = useRef(null);
    const flatListRef = useRef();
    const appLanguage = useSelector((state) => state.settings.appLanguage);
    const pagination = useSelector((state) => state.settings.pagination);

    const snapPoints = ["75%"];
    const pageBackgroundColor = getColor("pageBackgroundColor");
    const labelColor = getColor("LabelColor");

    const title = appLanguage === "eng" ? englishTitle : arabicTitle;
    const [currKey, setcurrKey] = useState(0);
    const [navTitle, setNavTitle] = useState(title);
    const [IsOnlyOneViewShown, setIsOnlyOneViewShown] = useState(false);
    const [IsTopNotBeginning, setIsTopNotBeginning] = useState(false);

    const data = getMain(path, motherSource, false, rule, 0)[0];
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
          break;
      }
      return content;
    };

    const scrollToNextItem = useCallback(() => {
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
    }, [currKey, height, IsOnlyOneViewShown]);

    const scrollBack = useCallback(() => {
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
    }, [currKey, IsTopNotBeginning]);

    const onHandlerStateChange = useCallback(
      ({ nativeEvent }) => {
        if (nativeEvent.state === State.END && pagination) {
          if (nativeEvent.velocityX > 0) {
            scrollBack();
          } else if (nativeEvent.velocityX < 0) {
            scrollToNextItem();
          }
        }
      },
      [scrollBack, scrollToNextItem, pagination]
    );

    return (
      <View>
        <FlatList
          ref={flatListRef}
          style={{ backgroundColor: pageBackgroundColor }}
          showsVerticalScrollIndicator={false}
          data={data}
          removeClippedSubviews={true}
          renderItem={renderItems}
          keyExtractor={(item) => item.key}
        />
      </View>
    );
  }
);

export default SingleHymnAsView;

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
