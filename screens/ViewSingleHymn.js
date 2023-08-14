import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { StyleSheet, Text, Pressable, FlatList } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

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

const ViewSingleHymn = memo(({ navigation, route }) => {
  const bottomSheetRef = useRef(null);
  const appLanguage = useSelector((state) => state.settings.appLanguage);

  const snapPoints = ["75%"];
  const flatListRef = useRef();
  const [navbarVisibility, setNavbarVisibility] = useState(true);
  const path = route.params.path;
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");

  const motherSource = route.params.motherSource;
  const rule = route.params.rule;
  const title =
    appLanguage === "eng"
      ? route.params.englishTitle
      : route.params.arabicTitle;

  const [navTitle, setNavTitle] = useState(title);
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
          <Icon name="ios-settings-outline" size={30} color={labelColor} />
        </Pressable>
      ),
      headerShown: navbarVisibility,
    });
  }, [navigation, navbarVisibility, navTitle]);

  const settingsPressed = () => {
    bottomSheetRef?.current.present();
  };

  return (
    <BottomSheetModalProvider>
      <SettingsModal bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      <FlatList
        ref={flatListRef}
        style={{ backgroundColor: pageBackgroundColor }}
        showsVerticalScrollIndicator={false}
        data={data}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
      />
    </BottomSheetModalProvider>
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
