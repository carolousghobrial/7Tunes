import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  memo,
} from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";

import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers";
import { getMain } from "../../viewModel/getFullViewModel";

import BaseView from "../../components/ViewTypes/BaseView";
import MelodyView from "../../components/ViewTypes/MelodyView";
import TitleView from "../../components/ViewTypes/TitleView";
import RitualView from "../../components/ViewTypes/RitualView";
import ButtonView from "../../components/ViewTypes/ButtonView";
import MainTitleView from "../../components/ViewTypes/MainTitleView";
import SettingsModal from "../../components/BottomBar/SettingsModal";

const ViewSingleHymn = () => {
  const { height } = useWindowDimensions();
  const flatListRef = useRef(null);

  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const pagination = useSelector((state) => state.settings.pagination);
  const isTablet = useSelector((state) => state.settings.isTablet);
  const navigation = useNavigation();

  const { path, motherSource, rule, englishTitle, arabicTitle } =
    useLocalSearchParams();

  const title = appLanguage === "eng" ? englishTitle : arabicTitle;
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const NavigationBarColor = getColor("NavigationBarColor");
  const labelColor = getColor("LabelColor");

  const fontSize = isTablet ? 30 : 15;

  const [navbarVisibility, setNavbarVisibility] = useState(true);
  const [currKey, setCurrKey] = useState(0);
  const [navTitle, setNavTitle] = useState(title);
  const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";

  const data = getMain(path, motherSource, false, rule, 0)[0];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: navTitle,
      headerStyle: {
        backgroundColor: NavigationBarColor,
      },
      headerTitleStyle: {
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: labelColor,
      },
      headerShown: navbarVisibility,
    });
  }, [navbarVisibility, navTitle]);

  const toggleNavbarVisibility = () => {
    setNavbarVisibility((prev) => !prev);
  };

  const renderItems = ({ item }) => {
    const renderComponent = () => {
      switch (item.part.Type) {
        case "Base":
          return <BaseView item={item.part} />;
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
              flatListRef={flatListRef}
              navigation={navigation}
            />
          );
        default:
          return <Text>Default</Text>;
      }
    };

    return (
      <Pressable onPress={toggleNavbarVisibility}>
        {renderComponent()}
      </Pressable>
    );
  };

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const scrollToNextItem = () => {
    const nextIndex = Math.min(currKey + 1, data.length - 1);
    scrollToIndex(nextIndex);
    setCurrKey(nextIndex);
  };

  const scrollToPrevItem = () => {
    const prevIndex = Math.max(currKey - 1, 0);
    scrollToIndex(prevIndex);
    setCurrKey(prevIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
        style={{ backgroundColor: pageBackgroundColor }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ViewSingleHymn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerButton: {
    marginHorizontal: 5,
  },
});
