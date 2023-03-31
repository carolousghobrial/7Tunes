import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { getFullViewModel } from "../viewModel/getFullViewModel";

function ButtonRules(item, motherSource, flatListRef, viewData, navigation) {
  function OpenTheotokia() {
    navigation.push("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.EnglishTitle,
      arabicTitle: item.ArabicTitle,
    });
  }
  function OpenDoxologies() {
    navigation.push("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.EnglishTitle,
      arabicTitle: item.ArabicTitle,
    });
  }
  function OpenPalmSundayProcession() {
    navigation.push("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.EnglishTitle,
      arabicTitle: item.ArabicTitle,
    });
  }
  function OpenPage() {
    navigation.push("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.EnglishTitle,
      arabicTitle: item.ArabicTitle,
    });
  }
  function ThokTeTiGomScrollUp() {
    var index = viewData.findIndex(
      (part) => part.EnglishTitle === "Pascha Praise"
    );
    var oldCount = item.Count;
    item.Count++;
    var oldReplacedString = "( " + oldCount + " )";
    var newReplacedString = "( " + item.Count + " )";
    item.English = item.English.replace(oldReplacedString, newReplacedString);
    item.Arabic = item.Arabic.replace(oldReplacedString, newReplacedString);
    if (item.Count > 12) {
      item.Visible = "hide";
    }
    flatListRef.current.scrollToIndex({
      index: index + 3,
      animated: false,
    });
  }
  function OpenSinglePage() {
    navigation.push("ViewSingleHymn", {
      path: item.Path,
      motherSource: motherSource,
      rule: item.Rule,
    });
  }
  return {
    OpenTheotokia: OpenTheotokia,
    OpenDoxologies: OpenDoxologies,
    OpenPalmSundayProcession: OpenPalmSundayProcession,
    OpenPage: OpenPage,
    ThokTeTiGomScrollUp: ThokTeTiGomScrollUp,
    OpenSinglePage: OpenSinglePage,
  };
}

export default ButtonRules;
