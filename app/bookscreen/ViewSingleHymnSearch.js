import React, {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  View,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { getColor } from "../../helpers/SettingsHelpers.js";
import { getMain } from "../../viewModel/getFullViewModel.js";
import BaseView from "../../components/ViewTypes/BaseView.js";
import MelodyView from "../../components/ViewTypes/MelodyView.js";
import TitleView from "../../components/ViewTypes/TitleView.js";
import RitualView from "../../components/ViewTypes/RitualView.js";
import ButtonView from "../../components/ViewTypes/ButtonView.js";
import MainTitleView from "../../components/ViewTypes/MainTitleView.js";

const ViewSingleHymnSearch = memo(() => {
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const router = useRouter();
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  const { path, rule, partClicked, englishTitle, arabicTitle } =
    useLocalSearchParams();

  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");
  const NavigationBarColor = getColor("NavigationBarColor");
  const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
  const title = appLanguage === "eng" ? englishTitle : arabicTitle;

  const [navbarVisibility, setNavbarVisibility] = useState(true);
  const data = getMain(path, "index", false, rule, 0)[0];

  /** Toggle Navbar Visibility */
  const hideHeader = useCallback(() => {
    setNavbarVisibility((prev) => !prev);
  }, []);

  /** Scroll to Index Handling */
  const onScrollToIndexFailed = useCallback((error) => {
    const offset = error.averageItemLength * error.index;
    flatListRef.current?.scrollToOffset({ offset, animated: false });

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: error.index,
        animated: false,
      });
    }, 10);
  }, []);

  /** Auto-scroll to Selected Part */
  useEffect(() => {
    const itemIndex = data.findIndex((item) =>
      item.part.English.includes(partClicked)
    );
    if (itemIndex !== -1) {
      flatListRef.current?.scrollToIndex({ index: itemIndex, animated: false });
    }
  }, [data, partClicked]);

  /** Dynamic Header Configuration */
  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerStyle: { backgroundColor: NavigationBarColor },
      headerTitleStyle: { fontSize: 20, fontFamily, color: labelColor },
      headerRight: () => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/bookscreen/settingsModal",
              params: { bookscreen: true },
            })
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <MaterialCommunityIcons name="cog" size={30} color={labelColor} />
        </Pressable>
      ),
      headerShown: navbarVisibility,
    });
  }, [
    navigation,
    navbarVisibility,
    title,
    NavigationBarColor,
    fontFamily,
    labelColor,
    router,
  ]);

  /** Render List Items */
  const renderItems = useCallback(
    ({ item }) => {
      const ComponentMap = {
        Base: BaseView,
        Melody: MelodyView,
        Title: TitleView,
        Ritual: RitualView,
        MainTitle: MainTitleView,
        Button: ButtonView,
      };

      const ViewComponent =
        ComponentMap[item.part.Type] || (() => <Text>Default</Text>);

      return (
        <Pressable onPress={hideHeader}>
          <ViewComponent
            item={item.part}
            {...(item.part.Type === "Button" && { flatListRef, navigation })}
            {...(item.part.Type === "Title" && { navigation })}
          />
        </Pressable>
      );
    },
    [hideHeader]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: pageBackgroundColor }]}
    >
      <FlatList
        ref={flatListRef}
        style={{ backgroundColor: pageBackgroundColor }}
        showsVerticalScrollIndicator={false}
        data={data}
        onScrollToIndexFailed={onScrollToIndexFailed}
        removeClippedSubviews
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
});

export default ViewSingleHymnSearch;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
