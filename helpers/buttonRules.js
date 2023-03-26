import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";
import { getFullViewModel } from "../viewModel/getFullViewModel";

function ButtonRules(item, motherSource, navigation) {
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
  return {
    OpenTheotokia: OpenTheotokia,
    OpenDoxologies: OpenDoxologies,
    OpenPalmSundayProcession: OpenPalmSundayProcession,
    OpenPage: OpenPage,
  };
}

export default ButtonRules;
