import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    "arabic-font": require("../assets/fonts/arabicFont.ttf"),
    "coptic-font": require("../assets/fonts/Shenouda.ttf"),
    "english-font": require("../assets/fonts/TimesNewerRoman-Regular.otf"),
    "arabictitle-font": require("../assets/fonts/MUDIR.ttf"),
    "englishtitle-font": require("../assets/fonts/AMRIGON.ttf"),
    "arabicritual-font": require("../assets/fonts/arabtype.ttf"),
  });
