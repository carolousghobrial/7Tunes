import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { getFullViewModel } from "../viewModel/getFullViewModel";
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
  const openBookScreen = (switchScreen = false) => {
    const routeMethod = switchScreen ? "replace" : "push";

    dispatch(setBookScrollTo({ bookScrollTo: 0 }));

    router[routeMethod]({
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

  const ThokTeTiGomScrollUpButtonRule = () => {
    const index = viewData.findIndex(
      (part) => part.EnglishTitle === "Pascha Praise"
    );
    const oldCount = item.Count;
    item.Count++;
    const oldReplacedString = `( ${oldCount} )`;
    const newReplacedString = `( ${item.Count} )`;
    item.English = item.English.replace(oldReplacedString, newReplacedString);
    item.Arabic = item.Arabic.replace(oldReplacedString, newReplacedString);
    if (item.Count >= 12) {
      item.Visible = "hide";
    }
    flatListRef.current.scrollToIndex({
      index: index + 3,
      animated: false,
    });
  };

  return {
    OpenTheotokiaButtonRule: () => openBookScreen(),
    OpenDoxologiesButtonRule: () => openBookScreen(),
    OpenPalmSundayProcessionButtonRule: () => openBookScreen(),
    OpenPageButtonRule: () => openBookScreen(),
    OpenNewPageButtonRule: () => openBookScreen(true),
    ThokTeTiGomScrollUpButtonRule: () => ThokTeTiGomScrollUpButtonRule(true),
    OpenSinglePageButtonRule: openViewSingleHymn,
    PopPage: () => router.back(),
  };
}

export default ButtonRules;
