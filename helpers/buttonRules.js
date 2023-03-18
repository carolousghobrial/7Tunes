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
      bookPath: item.path,
      englishTitle: item.English,
      arabicTitle: item.Arabic,
      motherSource: motherSource,
    });
  }
  return {
    OpenTheotokia: OpenTheotokia,
  };
}

export default ButtonRules;
