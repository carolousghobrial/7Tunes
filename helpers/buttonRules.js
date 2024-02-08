import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { getFullViewModel } from "../viewModel/getFullViewModel";

function ButtonRules(item, motherSource, flatListRef, viewData, navigation) {
  const openBookScreen = (switchScreen = false) => {
    navigation[switchScreen ? "replace" : "push"]("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.EnglishTitle,
      arabicTitle: item.ArabicTitle,
      motherSource: item.mother,
      Switch: item.Switch,
    });
  };

  const openViewSingleHymn = () => {
    const { Path, Rule, English, Arabic } = item;
    navigation.push("ViewSingleHymn", {
      path: Path,
      motherSource,
      rule: Rule,
      englishTitle: English,
      arabicTitle: Arabic,
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
    PopPage: () => navigation.pop(),
  };
}

export default ButtonRules;
