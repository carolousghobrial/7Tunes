import React, { useState, useRef, useEffect, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  useLocalSearchParams,
  useNavigation,
  Link,
  useRouter,
} from "expo-router";

// Import custom components and helpers
import BaseView from "../../components/ViewTypes/BaseView";
import MelodyView from "../../components/ViewTypes/MelodyView";
import TitleView from "../../components/ViewTypes/TitleView";
import RitualView from "../../components/ViewTypes/RitualView";
import ButtonView from "../../components/ViewTypes/ButtonView";
import MainTitleView from "../../components/ViewTypes/MainTitleView";
import AccordionView from "../../components/ViewTypes/AccordionView";
import FloatingButton from "../../components/ViewTypes/FloatingBishopButton";
import { getColor } from "../../helpers/SettingsHelpers";
import { getFullViewModel } from "../../viewModel/getFullViewModel";
import LoadingScreen from "../../screens/LoadingScreen";
import { setMenuScrollTo } from "../../stores/redux/book.js";

const BookScreen = React.memo(() => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const flatListRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();

  // Extract search params
  const { bookPath, motherSource, bishopButton, indexToScroll } =
    useLocalSearchParams();

  // Redux state
  const { pagination, BishopIsPresent, appLanguage, isTablet } = useSelector(
    (state) => state.settings
  );
  const { bookScrollTo } = useSelector((state) => state.book);
  const NavigationBarColor = getColor("NavigationBarColor");

  // Dynamic styles and configurations
  const labelColor = getColor("LabelColor");
  const pageBackgroundColor = getColor("pageBackgroundColor");
  const fontFamily = appLanguage === "eng" ? "english-font" : "arabic-font";
  const fontSize = isTablet ? 30 : 15;
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [navbarVisibility, setNavbarVisibility] = useState(true);
  const [expanded, setExpanded] = useState([]);
  const [contents, menuData] = getFullViewModel(bookPath, motherSource);
  const [bookContents, setBookContents] = useState(contents);
  const [navTitle, setNavTitle] = useState(contents[0]?.part.English);
  const stringifiedMenu = JSON.stringify(menuData);
  // Update navigation options dynamically
  React.useLayoutEffect(() => {
    setTimeout(() => {
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
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
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
                <MaterialCommunityIcons
                  name="cog"
                  size={30}
                  color={labelColor}
                />
              </View>
            </Pressable>
            <Pressable
              onPressIn={() =>
                router.push({
                  pathname: "/bookscreen/modal",
                  params: {
                    menuData: stringifiedMenu,
                    title: contents[0]?.part.English,
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
                <MaterialCommunityIcons
                  name="table-of-contents"
                  size={40}
                  color={labelColor}
                />
              </View>
            </Pressable>
          </View>
        ),
        headerShown: navbarVisibility,
      });
      setIsLoading(false); // Hide the loading state once done
    }, 10); // Adjust timeout if needed to allow time for rendering
  }, [labelColor]);
  useEffect(() => {
    navigation.setOptions({
      title: navTitle,
      headerShown: navbarVisibility,
    });
  }, [navbarVisibility, navTitle]);
  // Scroll FlatList when targetIndex changes
  useEffect(() => {
    if (bookScrollTo !== null && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: bookScrollTo,
        animated: false,
      });
    }
  }, [bookScrollTo]);

  const toggleAccordion = (index) => {
    setExpanded((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleViewableItemsChanged = ({ viewableItems }) => {
    const firstItem = viewableItems[0]?.item;
    if (firstItem) {
      setNavTitle(
        appLanguage === "eng" ? firstItem.EnglishTitle : firstItem.ArabicTitle
      );
      const ind = menuData.findIndex(
        (item) => item.EnglishTitle === firstItem.EnglishTitle
      );
      dispatch(setMenuScrollTo({ menuScrollTo: ind }));
    }
  };

  const renderItem = ({ item }) => {
    const viewTypeMap = {
      Base: <BaseView item={item.part} />,
      Melody: <MelodyView item={item.part} />,
      Title: <TitleView item={item.part} />,
      Ritual: <RitualView item={item.part} />,
      MainTitle: <MainTitleView item={item.part} />,
      Button: (
        <ButtonView
          item={item.part}
          flatListRef={flatListRef}
          viewData={bookContents}
        />
      ),
      Accordion: (
        <AccordionView
          item={item.part}
          toggleAccordion={toggleAccordion}
          expanded={expanded}
        />
      ),
    };
    return (
      <Pressable
        onPress={() => setNavbarVisibility(!navbarVisibility)}
        onLongPress={() =>
          router.push({
            pathname: "/bookscreen/modal", // The destination route
            params: {
              // Pass parameters as query string
              menuData: stringifiedMenu,
              title: contents[0]?.part.English,
            },
          })
        }
      >
        {viewTypeMap[item.part.Type]}
      </Pressable>
    );
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
    <SafeAreaView
      style={[{ backgroundColor: pageBackgroundColor }, styles.container]}
    >
      <FlatList
        ref={flatListRef}
        data={bookContents}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={handleViewableItemsChanged}
        initialNumToRender={bookContents.length}
        style={[styles.list, { backgroundColor: pageBackgroundColor }]}
        showsVerticalScrollIndicator={false}
      />
      {BishopIsPresent && bishopButton && (
        <FloatingButton navigation={navigation} />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
});

export default BookScreen;
