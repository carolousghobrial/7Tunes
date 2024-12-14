import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  View,
  SafeAreaView,
} from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getLanguageValue,
  getFontSize,
  getColor,
} from "../../helpers/SettingsHelpers.js";
import { getMain } from "../../viewModel/getFullViewModel.js";
import BaseView from "../../components/ViewTypes/BaseView.js";
import MelodyView from "../../components/ViewTypes/MelodyView.js";
import TitleView from "../../components/ViewTypes/TitleView.js";
import RitualView from "../../components/ViewTypes/RitualView.js";
import ButtonView from "../../components/ViewTypes/ButtonView.js";
import MainTitleView from "../../components/ViewTypes/MainTitleView.js";
import SettingsModal from "../../components/BottomBar/SettingsModal.js";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";

const ViewSingleHymnSearch = memo(() => {
  const bottomSheetRef = useRef(null);
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  // Extract search params
  const { path, rule, partClicked, searchPhrase, englishTitle, arabicTitle } =
    useLocalSearchParams();
  const navigation = useNavigation();
  const NavigationBarColor = getColor("NavigationBarColor");
  const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
  const router = useRouter();

  const flatListRef = useRef();
  const [navbarVisibility, setNavbarVisibility] = useState(true);

  const pageBackgroundColor = getColor("pageBackgroundColor");
  const labelColor = getColor("LabelColor");

  const title = appLanguage === "eng" ? englishTitle : arabicTitle;

  const [navTitle, setNavTitle] = useState(title);
  const data = getMain(path, "index", false, rule, 0)[0];

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
        content = <TitleView item={item.part} navigation={navigation} />;
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
  useEffect(() => {
    const itemToFind = data.filter((item) =>
      item.part.English.includes(partClicked)
    );
    flatListRef.current.scrollToIndex({
      index: itemToFind[0].key,
      animated: false,
    });
  }, []);
  const hideHeader = () => {
    setNavbarVisibility(!navbarVisibility);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: navTitle,
      headerStyle: {
        backgroundColor: NavigationBarColor,
      },
      headerTitleStyle: {
        fontSize: 20,
        fontFamily: fontFamily,
        color: labelColor,
      },
      headerRight: () => (
        <Pressable
          onPressIn={() =>
            router.push({
              pathname: "/bookscreen/settingsModal",
              params: {
                bookscreen: true,
              },
            })
          }
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <MaterialCommunityIcons name="cog" size={30} color={labelColor} />
          </View>
        </Pressable>
      ),
      headerShown: navbarVisibility,
    });
  }, [navigation, navbarVisibility, navTitle]);

  return (
    <SafeAreaView
      style={[{ backgroundColor: pageBackgroundColor }, styles.container]}
    >
      <FlatList
        ref={flatListRef}
        style={{ backgroundColor: pageBackgroundColor }}
        showsVerticalScrollIndicator={false}
        data={data}
        onScrollToIndexFailed={onScrollToIndexFailed}
        removeClippedSubviews={true}
        renderItem={renderItems}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
});

export default ViewSingleHymnSearch;

const styles = StyleSheet.create({
  container: { flex: 1 },

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
