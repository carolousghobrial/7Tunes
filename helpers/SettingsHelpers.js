import Colors from "../constants/colors";
import Languages from "../constants/languages";
import { useDispatch, useSelector } from "react-redux";

export function getLanguageValue(key) {
  const appLanguage = useSelector((state) => state.settings.appLanguage);
  return Languages[appLanguage][key];
}
export function getFontSize() {
  const fontSize = useSelector((state) => state.settings.textFontSize);

  return fontSize;
}
export function getColor(key) {
  const darkMode = useSelector((state) => state.settings.darkMode);
  var activeColors = darkMode === false ? Colors["light"] : Colors["dark"];

  return activeColors[key];
}
