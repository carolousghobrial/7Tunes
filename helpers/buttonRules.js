import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { setBookScrollTo } from "../stores/redux/book.js";

function ButtonRules(
  item,
  motherSource,
  flatListRef,
  viewData,
  router,
  dispatch
) {
  // Helper for updating item counts
  const updateItemCount = () => {
    const oldCount = item.Count;
    item.Count++;
    const oldReplacedString = `( ${oldCount} )`;
    const newReplacedString = `( ${item.Count} )`;
    item.English = item.English.replace(oldReplacedString, newReplacedString);
    item.Arabic = item.Arabic.replace(oldReplacedString, newReplacedString);

    if (item.Count >= 12) {
      item.Visible = "hide";
    }
  };

  // Unified book screen opener
  const openBookScreen = (switchScreen = false) => {
    dispatch(setBookScrollTo({ bookScrollTo: 0 }));

    router[switchScreen ? "replace" : "push"]({
      pathname: "/bookscreen/BookScreen",
      params: {
        bookPath: item.Path,
        englishTitle: item.English,
        arabicTitle: item.Arabic,
        motherSource: item.mother,
        Switch: item.Switch,
      },
    });
  };

  // Open a single hymn view
  const openViewSingleHymn = () => {
    const { Path, Rule, English, Arabic } = item;
    router.push({
      pathname: "/bookscreen/ViewSingleHymn",
      params: {
        path: Path,
        motherSource,
        rule: Rule,
        englishTitle: English,
        arabicTitle: Arabic,
      },
    });
  };

  // Scroll up button rule
  const ThokTeTiGomScrollUpButtonRule = () => {
    const index = viewData.findIndex(
      (part) => part.EnglishTitle === "Pascha Praise"
    );
    updateItemCount();
    flatListRef.current.scrollToIndex({
      index: index + 3,
      animated: false,
    });
  };

  return {
    OpenTheotokiaButtonRule: openBookScreen,
    OpenDoxologiesButtonRule: openBookScreen,
    OpenPalmSundayProcessionButtonRule: openBookScreen,
    OpenPageButtonRule: openBookScreen,
    OpenNewPageButtonRule: () => openBookScreen(true),
    ThokTeTiGomScrollUpButtonRule,
    OpenSinglePageButtonRule: openViewSingleHymn,
    PopPage: () => router.back(),
  };
}

export default ButtonRules;
