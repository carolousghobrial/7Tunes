import {
  StyleSheet,
  ImageBackground,
  Linking,
  Alert,
  Share,
} from "react-native";

function ButtonRules(item, motherSource, navigation) {
  function OpenTheotokia() {
    navigation.push("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.English,
      arabicTitle: item.Arabic,
      motherSource: motherSource,
    });
  }
  function OpenDoxologies() {
    navigation.push("BookScreen", {
      bookPath: item.Path,
      englishTitle: item.English,
      arabicTitle: item.Arabic,
      motherSource: motherSource,
    });
  }
  return {
    OpenTheotokia: OpenTheotokia,
    OpenDoxologies: OpenDoxologies,
  };
}

export default ButtonRules;
